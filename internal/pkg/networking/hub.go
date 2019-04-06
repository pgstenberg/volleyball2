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

	clientRegisterCallbacks   []ClientRegisterCallback
	clientUnregisterCallbacks []ClientUnregisterCallback
}

type ClientRegisterCallback func(clientID uint8)
type ClientUnregisterCallback func(clientID uint8)

func (h *hub) clientID() uint8 {
	return uint8(len(h.clients))
}

func (h *hub) addClientRegisterCallback(clientRegisterCallback ClientRegisterCallback) {
	h.clientRegisterCallbacks = append(h.clientRegisterCallbacks, clientRegisterCallback)
}
func (h *hub) addClientUnregisterCallback(clientUnregisterCallback ClientUnregisterCallback) {
	h.clientUnregisterCallbacks = append(h.clientUnregisterCallbacks, clientUnregisterCallback)
}

func (h *hub) start() {
	for {
		select {
		case client := <-h.register:

			log.Printf("New Client %d connected from %s.",
				client.id,
				client.conn.LocalAddr())

			h.clients[client.id] = client

			for _, registerCallback := range h.clientRegisterCallbacks {
				registerCallback(client.id)
			}

		case client := <-h.unregister:
			if _, ok := h.clients[client.id]; ok {
				log.Printf("Client %d disconnected.", client.id)

				delete(h.clients, client.id)
				close(client.send)

				for _, unregisterCallback := range h.clientRegisterCallbacks {
					unregisterCallback(client.id)
				}
			}
		case message := <-h.broadcast:

			for _, client := range h.clients {
				client.send <- message
			}

		}
	}
}
