package networking

import (
	"log"
)

type Hub struct {

	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	Register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub(broadcast chan []byte) *Hub {
	return &Hub{
		broadcast:  broadcast,
		Register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) CalcClientID() uint8 {
	return uint8(len(h.clients))
}

func (h *Hub) Start() {
	for {
		select {
		case client := <-h.Register:

			log.Printf("New Client %s connected from %s.",
				client.ID,
				client.Conn.LocalAddr())

			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				log.Printf("Client %s disconnected.", client.ID)
				delete(h.clients, client)
				close(client.Send)
			}
		case message := <-h.broadcast:

			numClients := uint8(message[0])

			for client := range h.clients {

				if numClients > 0 {
					for _, bClientID := range message[1 : numClients+1] {
						if client.ID == uint8(bClientID) {
							select {
							case client.Send <- message[numClients+1:]:
							default:
								close(client.Send)
								delete(h.clients, client)
							}
						}
					}
				} else {
					select {
					case client.Send <- message[1:]:
					default:
						close(client.Send)
						delete(h.clients, client)
					}
				}

			}

		}
	}
}
