package networking

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type Server struct {
	networkInputChannel  chan []byte
	networkOutputChannel chan []byte
	inputBuffer          [][]byte
	outputBuffer         [][]byte
	mutex                *sync.Mutex
}

func Create(registerCallback ClientRegisterCallback, unregisterCallback ClientUnregisterCallback) *Server {

	server := &Server{
		networkInputChannel:  make(chan []byte),
		networkOutputChannel: make(chan []byte),
		inputBuffer:          [][]byte{},
		outputBuffer:         [][]byte{},
		mutex:                &sync.Mutex{},
	}

	hub := &hub{
		broadcast:  server.networkOutputChannel,
		register:   make(chan *client),
		unregister: make(chan *client),
		clients:    make(map[*client]bool),
	}

	go server.run()
	go hub.start(registerCallback, unregisterCallback)

	upgrader := websocket.Upgrader{}
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ws(hub, server.networkInputChannel, &upgrader, w, r)
	})

	return server
}

func (server *Server) run() {
	for data := range server.networkInputChannel {
		server.mutex.Lock()
		server.inputBuffer = append(server.inputBuffer, data)
		server.mutex.Unlock()
	}
}

func (server *Server) Flush() {
	for _, data := range server.outputBuffer {
		server.networkOutputChannel <- data
	}
}

func (server *Server) Send(data []byte, targets ...uint8) {
	if len(targets) == 0 {
		server.outputBuffer = append(server.outputBuffer, data)
		return
	}

	server.outputBuffer = append(server.outputBuffer, []byte{uint8(len(targets))})

	for target := range targets {
		server.outputBuffer = append(server.outputBuffer, []byte{uint8(target)})
	}
}

func (server *Server) Read() [][]byte {
	inputs := [][]byte{}
	server.mutex.Lock()
	copy(inputs, server.inputBuffer)
	server.inputBuffer = [][]byte{}
	server.mutex.Unlock()
	return inputs
}

func (server *Server) Close() {
	close(server.networkInputChannel)
	close(server.networkOutputChannel)
}

func ws(hub *hub, inputChannel chan []byte, upgrader *websocket.Upgrader, w http.ResponseWriter, r *http.Request) {

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	// Create new client
	client := &client{
		hub:  hub,
		conn: conn,
		send: make(chan []byte, 256),
		id:   hub.clientID()}

	client.hub.register <- client

	go client.read(inputChannel)
	go client.write()

}
