package system

import (
	"encoding/binary"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/networking"
)

type InstreamSystem struct {
	server  *networking.Server
	clients map[uint8]string
}

func NewInstreamSystem(server *networking.Server, clients map[uint8]string) *InstreamSystem {
	return &InstreamSystem{
		server:  server,
		clients: clients,
	}
}

func (is *InstreamSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	for _, b := range is.server.Read() {

		clientID := uint8(b[0])
		packageType := uint8(b[1])

		entity, ok := is.clients[clientID]

		if !ok {
			continue
		}

		switch packageType {
		// Client Inputs
		case 1:

			if !entityManager.EntityExists(entity) {
				break
			}

			ic := (*entityManager.GetEntityComponents(entity, constant.InputComponent)[constant.InputComponent]).(*component.InputComponent)

			tick := binary.LittleEndian.Uint16(b[2:4])
			ic.Input[tick] = []bool{false, false, false}

			for idx := 4; idx < len(b); idx++ {
				id := uint8(b[idx])
				ic.Input[tick][id] = true
			}

		// Sync Event
		case 2:
			b := []byte{uint8(2)}
			d := make([]byte, 2)
			binary.LittleEndian.PutUint16(d, tick)
			b = append(b, d...)

			is.server.Send(b, clientID)

		}
	}

}
