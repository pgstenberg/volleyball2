package networking

import (
	"log"
)

type hub struct {

	// Registered clients.
	clients map[uint8]*client

	// Inbound messages from the clients.
	broadcast chan []byte

	input chan []byte

	// Register requests from the clients.
	register chan *client

	// Unregister requests from clients.
	unregister chan *client
}

type ClientRegisterCallback func(clientID uint8)
type ClientUnregisterCallback func(clientID uint8)

func (h *hub) clientID() uint8 {
	return uint8(len(h.clients))
}

func (h *hub) start(registerCallback ClientRegisterCallback, unregisterCallback ClientUnregisterCallback) {
	for {
		select {
		case client := <-h.register:

			log.Printf("New Client %d connected from %s.",
				client.id,
				client.conn.LocalAddr())

			h.clients[client.id] = client

			registerCallback(client.id)

		case client := <-h.unregister:
			if _, ok := h.clients[client.id]; ok {
				log.Printf("Client %d disconnected.", client.id)

				delete(h.clients, client.id)
				close(client.send)

				unregisterCallback(client.id)
			}
		case message := <-h.broadcast:

			for _, client := range h.clients {
				client.send <- message
			}

		}
	}
}
