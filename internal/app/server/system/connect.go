package system

import (
	"fmt"
	"sync"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/networking"
)

type ConnectSystem struct {
	server              *networking.Server
	clients             map[uint8]string
	pendingClients      []uint8
	pendingClientsMutex *sync.Mutex
}

func NewConnectSystem(server *networking.Server, clients map[uint8]string) *ConnectSystem {

	system := &ConnectSystem{
		server:              server,
		clients:             clients,
		pendingClients:      []uint8{},
		pendingClientsMutex: &sync.Mutex{},
	}

	server.AddClientRegisterCallback(func(clientID uint8) {
		system.pendingClientsMutex.Lock()
		system.pendingClients = append(system.pendingClients, clientID)
		system.pendingClientsMutex.Unlock()
	})
	server.AddClientUnregisterCallback(func(clientID uint8) {
		system.pendingClientsMutex.Lock()
		if system.clients != nil {
			delete(system.clients, clientID)
		}
		system.pendingClientsMutex.Unlock()
	})

	return system
}

func (cs *ConnectSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	cs.pendingClientsMutex.Lock()
	for _, cid := range cs.pendingClients {
		cs.clients[cid] = entityManager.CreateEntity()
		fmt.Printf("New entity %s created due to client %d connected.\n", cs.clients[cid], cid)

		entityManager.CreateComponent(cs.clients[cid], constant.InputComponent)
		entityManager.CreateComponent(cs.clients[cid], constant.VelocityComponent)
		entityManager.CreateComponent(cs.clients[cid], constant.TransformComponent)
		entityManager.CreateComponent(cs.clients[cid], constant.JumpComponent)

		if len(cs.clients) == 1 {
			cs.server.Send([]byte{uint8(1), uint8(cid)}, cid)
			break
		}

		for cid0 := range cs.clients {
			c := []byte{uint8(1), uint8(cid0)}
			for cid1 := range cs.clients {
				if cid1 != cid0 {
					c = append(c, cid1)
				}
			}
			cs.server.Send(c, cid0)
		}
	}
	cs.pendingClients = nil
	cs.pendingClientsMutex.Unlock()

}
