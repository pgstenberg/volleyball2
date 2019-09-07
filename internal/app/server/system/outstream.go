package system

import (
	"encoding/binary"
	"math"
	"fmt"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/networking"
)

type OutstreamSystem struct {
	server  *networking.Server
	clients map[uint8]string
	objects map[uint8]string
}

func NewOutstreamSystem(server *networking.Server, clients map[uint8]string, objects map[uint8]string) *OutstreamSystem {
	return &OutstreamSystem{
		server:  server,
		clients: clients,
		objects: objects,
	}
}

func (os *OutstreamSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if pause {
		return
	}

	desyncedEntities := entityManager.GetComponents(true, constant.PlayerComponent)

	for entityID, components := range desyncedEntities {

		pc := (*components[constant.PlayerComponent]).(*component.PlayerComponent)

		if !pc.Desynced {
			continue
		}

		for k, v := range os.clients {
			if v == entityID {
				os.server.Send([]byte{uint8(5)}, k)
				break
			}
		}
	}

	/*
		INTERPOLATION PACKAGES
	*/ 
	interpolationEntities := entityManager.GetComponents(true, constant.TransformComponent, constant.NetworkComponent)

	binputs := []byte{}

	for entityID, components := range interpolationEntities {

		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)
		nc := (*components[constant.NetworkComponent]).(*component.NetworkComponent)

		if nc.Interpolate {

			if !nc.RequireInterpolation {
				continue
			}

			for k, v := range os.clients {
				if v == entityID {
					binputs = append(binputs, []byte{k}...)
					break
				}
			}

			dx := make([]byte, 2)
			binary.LittleEndian.PutUint16(dx, tc.PositionX)
			binputs = append(binputs, dx...)

			dy := make([]byte, 2)
			binary.LittleEndian.PutUint16(dy, tc.PositionY)
			binputs = append(binputs, dy...)

		}


	}

	if len(binputs) > 0 {
		b0 := []byte{uint8(3), uint8(len(binputs) / 5)}

		dt := make([]byte, 2)
		binary.LittleEndian.PutUint16(dt, tick)
		b0 = append(b0, dt...)

		b0 = append(b0, binputs...)
		os.server.Send(b0)
	}

	/*
		SYNCHRONIZATION PACKAGES
	*/ 
	synchronizeEntities := entityManager.GetComponents(true, constant.TransformComponent, constant.VelocityComponent, constant.NetworkComponent)

	binputs = []byte{}

	for entityID, components := range synchronizeEntities {

		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)
		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)
		nc := (*components[constant.NetworkComponent]).(*component.NetworkComponent)

		if nc.Synchronize {

			if !nc.RequireSynchronize {
				continue
			}

			for k, v := range os.objects {
				if v == entityID {
					binputs = append(binputs, []byte{k}...)
					break
				}
			}

			dx := make([]byte, 2)
			binary.LittleEndian.PutUint16(dx, tc.PositionX)
			binputs = append(binputs, dx...)

			dy := make([]byte, 2)
			binary.LittleEndian.PutUint16(dy, tc.PositionY)
			binputs = append(binputs, dy...)



			dvx := make([]byte, 8)
			binary.LittleEndian.PutUint64(dvx, math.Float64bits(vc.VelocityX))
			binputs = append(binputs, dvx...)

			dvy := make([]byte, 8)
			binary.LittleEndian.PutUint64(dvy, math.Float64bits(vc.VelocityY))
			binputs = append(binputs, dvy...)

			fmt.Printf("SENDING VX: %d, VY: %d\n", vc.VelocityX, vc.VelocityY)
			fmt.Println(dvx)
			fmt.Println(dvy)
		}
	}

	if len(binputs) > 0 {
		b0 := []byte{uint8(4), uint8(len(binputs) / 21)}

		dt := make([]byte, 2)
		binary.LittleEndian.PutUint16(dt, tick)
		b0 = append(b0, dt...)

		b0 = append(b0, binputs...)
		os.server.Send(b0)
	}

}
