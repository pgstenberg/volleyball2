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

func (ts *NetworkSystem) Update(entityManager *core.EntityManager, tick uint16, delta float64) {

	ts.pendingClientsMutex.Lock()
	for _, cid := range ts.pendingClients {
		ts.clients[cid] = entityManager.CreateEntity()
		fmt.Printf("New entity %s created due to client %d connected.\n", ts.clients[cid], cid)

		entityManager.CreateComponent(ts.clients[cid], constant.InputComponent)
		entityManager.CreateComponent(ts.clients[cid], constant.VelocityComponent)
		entityManager.CreateComponent(ts.clients[cid], constant.TransformComponent)

		ts.server.Send([]byte{uint8(1), uint8(cid)}, cid)
	}
	ts.pendingClients = nil
	ts.pendingClientsMutex.Unlock()

	for _, b := range ts.server.Read() {

		clientID := uint8(b[0])
		packageType := uint8(b[1])

		entity, ok := ts.clients[clientID]

		if !ok {
			continue
		}

		switch packageType {
		// Client Inputs
		case 1:
			ic := (*entityManager.GetEntityComponents(entity, constant.InputComponent)[constant.InputComponent]).(*component.InputComponent)

			tick := binary.LittleEndian.Uint16(b[3:5])
			ic.Input[tick] = []bool{false, false, false}

			for idx := 5; idx < len(b); idx++ {
				id := uint8(b[idx])
				ic.Input[tick][id] = true
			}

			fmt.Printf("INPUT %d=%s\n", tick, ic.Input[tick])

		// Sync Event
		case 2:
			b := []byte{uint8(2)}
			d := make([]byte, 2)
			binary.LittleEndian.PutUint16(d, tick)
			b = append(b, d...)

			fmt.Printf("TICK: %d\n", tick)

			ts.server.Send(b, clientID)

		}
	}

}
