package system

import (
	"encoding/binary"

	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/networking"
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

	if pause {
		return
	}

	entities := entityManager.GetComponents(true, constant.TransformComponent)

	binputs := []byte{}

	for entityID, components := range entities {

		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

		if tc.PrevPositionX == tc.PositionX && tc.PrevPositionY == tc.PositionY {
			continue
		}

		for k, v := range os.clients {
			if v == entityID {
				binputs = append(binputs, []byte{k}...)
			}
		}

		dx := make([]byte, 2)
		binary.LittleEndian.PutUint16(dx, tc.PositionX)
		binputs = append(binputs, dx...)

		dy := make([]byte, 2)
		binary.LittleEndian.PutUint16(dy, tc.PositionY)
		binputs = append(binputs, dy...)

	}

	if len(binputs) > 0 {
		b0 := []byte{uint8(3), uint8(len(binputs) / 5)}

		dt := make([]byte, 2)
		binary.LittleEndian.PutUint16(dt, tick)
		b0 = append(b0, dt...)

		b0 = append(b0, binputs...)
		os.server.Send(b0)
	}

}
