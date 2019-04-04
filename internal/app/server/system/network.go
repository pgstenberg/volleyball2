package system

import (
	"encoding/binary"
	"fmt"
	"sync"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/networking"
)

type NetworkSystem struct {
	server              *networking.Server
	clients             map[uint8]string
	pendingClients      []uint8
	pendingClientsMutex *sync.Mutex
}

func NewNetworkSystem() *NetworkSystem {

	system := NetworkSystem{
		clients:             make(map[uint8]string),
		pendingClients:      []uint8{},
		pendingClientsMutex: &sync.Mutex{},
	}

	system.server = networking.Create(func(clientID uint8) {
		system.pendingClientsMutex.Lock()
		system.pendingClients = append(system.pendingClients, clientID)
		system.pendingClientsMutex.Unlock()
	}, func(clientID uint8) {
		system.pendingClientsMutex.Lock()
		if system.clients != nil {
			delete(system.clients, clientID)
		}
		system.pendingClientsMutex.Unlock()
	})

	return &system
}

func (ns *NetworkSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	ns.pendingClientsMutex.Lock()
	for _, cid := range ns.pendingClients {
		ns.clients[cid] = entityManager.CreateEntity()
		fmt.Printf("New entity %s created due to client %d connected.\n", ns.clients[cid], cid)

		entityManager.CreateComponent(ns.clients[cid], constant.InputComponent)
		entityManager.CreateComponent(ns.clients[cid], constant.VelocityComponent)
		entityManager.CreateComponent(ns.clients[cid], constant.TransformComponent)
		entityManager.CreateComponent(ns.clients[cid], constant.JumpComponent)

		ns.server.Send([]byte{uint8(1), uint8(cid)}, cid)
	}
	ns.pendingClients = nil
	ns.pendingClientsMutex.Unlock()

	for _, b := range ns.server.Read() {

		clientID := uint8(b[0])
		packageType := uint8(b[1])

		entity, ok := ns.clients[clientID]

		if !ok {
			continue
		}

		switch packageType {
		// Client Inputs
		case 1:
			ic := (*entityManager.GetEntityComponents(entity, constant.InputComponent)[constant.InputComponent]).(*component.InputComponent)

			tick := binary.LittleEndian.Uint16(b[3:6])
			ic.Input[tick] = []bool{false, false, false}

			for idx := 7; idx < len(b); idx++ {
				id := uint8(b[idx])
				ic.Input[tick][id] = true
			}

		// Sync Event
		case 2:
			b := []byte{uint8(2)}
			d := make([]byte, 2)
			binary.LittleEndian.PutUint16(d, tick)
			b = append(b, d...)

			ns.server.Send(b, clientID)

		}
	}

}
