package networking

import (
	"log"
)

type hub struct {

	// Registered clients.
	clients map[*client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *client

	// Unregister requests from clients.
	unregister chan *client
}

type ClientRegisterCallback func(id uint8)
type ClientUnregisterCallback func(id uint8)

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

			h.clients[client] = true

			registerCallback(client.id)

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				log.Printf("Client %d disconnected.", client.id)
				delete(h.clients, client)
				close(client.send)

				unregisterCallback(client.id)
			}
		case message := <-h.broadcast:

			numClients := uint8(message[0])

			for client := range h.clients {

				if numClients > 0 {
					for _, bClientID := range message[1 : numClients+1] {
						if client.id == uint8(bClientID) {
							select {
							case client.send <- message[numClients+1:]:
							default:
								close(client.send)
								delete(h.clients, client)
							}
						}
					}
				} else {
					select {
					case client.send <- message[1:]:
					default:
						close(client.send)
						delete(h.clients, client)
					}
				}

			}

		}
	}
}
