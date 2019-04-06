package system

import (
	"encoding/binary"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/networking"
)

type OutstreamSystem struct {
	server  *networking.Server
	clients map[uint8]string
}

func NewOutstreamSystem(server *networking.Server, clients map[uint8]string) *OutstreamSystem {
	return &OutstreamSystem{
		server:  server,
		clients: clients,
	}
}

func (os *OutstreamSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if (tick % 3) == 0 {

		entities := entityManager.GetComponents(constant.TransformComponent)

		b := []byte{uint8(3), uint8(len(entities))}

		dt := make([]byte, 2)
		binary.LittleEndian.PutUint16(dt, tick)
		b = append(b, dt...)

		for entityID, components := range entities {

			tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

			for k, v := range os.clients {
				if v == entityID {
					b = append(b, k)
				}
			}

			dx := make([]byte, 2)
			binary.LittleEndian.PutUint16(dx, tc.PositionX)
			b = append(b, dx...)

			dy := make([]byte, 2)
			binary.LittleEndian.PutUint16(dy, tc.PositionY)
			b = append(b, dy...)

		}

		os.server.Send(b)
	}

}
