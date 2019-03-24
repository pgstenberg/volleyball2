package networking

type Server struct {
	networkInputChannel  chan []byte
	networkOutputChannel chan []byte
	InputBuffer          [][]byte
	OutputBuffer         [][]byte
}

func NewServer() *Server {
	server := &Server{
		networkInputChannel:  make(chan []byte),
		networkOutputChannel: make(chan []byte),
		InputBuffer:          [][]byte{},
		OutputBuffer:         [][]byte{},
	}
	go server.run()
	return server
}

func (server *Server) run() {
	for data := range server.networkInputChannel {
		server.InputBuffer = append(server.InputBuffer, data)
	}
}

func (server *Server) Flush() {
	for _, data := range server.OutputBuffer {
		server.networkOutputChannel <- data
	}
}

func (server *Server) Close() {
	close(server.networkInputChannel)
	close(server.networkOutputChannel)
}
