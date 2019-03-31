package networking

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type Server struct {
	hub          *hub
	inputBuffer  [][]byte
	outputBuffer [][]byte
	inputMutex   *sync.Mutex
}

func Create(registerCallback ClientRegisterCallback, unregisterCallback ClientUnregisterCallback) *Server {

	server := &Server{
		inputBuffer:  [][]byte{},
		outputBuffer: [][]byte{},
		inputMutex:   &sync.Mutex{},
		hub: &hub{
			broadcast:  make(chan []byte),
			input:      make(chan []byte),
			register:   make(chan *client),
			unregister: make(chan *client),
			clients:    make(map[uint8]*client),
		},
	}

	go server.run()
	go server.hub.start(registerCallback, unregisterCallback)

	upgrader := websocket.Upgrader{}
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ws(server.hub, &upgrader, w, r)
	})

	return server
}

func (server *Server) run() {
	for data := range server.hub.input {
		server.inputMutex.Lock()
		server.inputBuffer = append(server.inputBuffer, data)
		server.inputMutex.Unlock()
	}
}

func (server *Server) Send(data []byte, targets ...uint8) {

	if len(targets) == 0 {
		server.hub.broadcast <- data
		return
	}

	for _, target := range targets {
		server.hub.clients[target].send <- data
	}

}

func (server *Server) Read() [][]byte {
	server.inputMutex.Lock()
	inputs := make([][]byte, len(server.inputBuffer))
	for idx := range server.inputBuffer {
		inputs[idx] = make([]byte, len(server.inputBuffer[idx]))
		copy(inputs[idx], server.inputBuffer[idx])
	}
	server.inputBuffer = nil
	server.inputMutex.Unlock()
	return inputs
}

func (server *Server) Close() {
	close(server.hub.input)
	close(server.hub.broadcast)
}

func ws(hub *hub, upgrader *websocket.Upgrader, w http.ResponseWriter, r *http.Request) {

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

	go client.read(hub.input)
	go client.write()

}
