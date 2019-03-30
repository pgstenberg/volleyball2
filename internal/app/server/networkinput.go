package server

import (
	"encoding/binary"

	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/networking"
)

type networkinputSystem struct {
	server    *networking.Server
	clientMap map[uint8]string
}

func createNetworkSystem() *networkinputSystem {
	return &networkinputSystem{
		server: networking.Create(func(id uint8) {

		}, func(id uint8) {

		}),
	}
}

func (ts networkinputSystem) ID() string {
	return "networkinputsystem"
}

func (ts networkinputSystem) Update(entityManager *core.EntityManager, tick uint16, delta float64) {

	for _, b := range ts.server.Read() {
		clientID := uint8(b[0])
		packageType := uint8(b[1])

		switch packageType {
		// Client Inputs
		case 1:
			ic := (*entityManager.GetEntityComponents("", "input")["input"]).(*inputComponent)
			ic.tick = tick

			for idx := 9; idx < len(b); idx++ {
				id := uint8(b[idx])
				ic.input[id] = true
			}

		// Sync Event
		case 2:
			breturn := []byte{1, clientID, 2}
			a := make([]byte, 2)
			binary.LittleEndian.PutUint16(a, tick)
			breturn = append(breturn, a...)

		}
	}

}
