package system

import (
	"fmt"
	"math"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
)

type TransformSystem struct{}

func (ts *TransformSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if pause {
		return
	}

	for id, components := range entityManager.GetComponents(constant.VelocityComponent, constant.TransformComponent) {

		if components[constant.VelocityComponent] == nil || components[constant.TransformComponent] == nil {
			return
		}

		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)
		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

		if vc.VelocityX > constant.MaxVelocityX {
			vc.VelocityX = constant.MaxVelocityX
		} else if vc.VelocityX < -constant.MaxVelocityX {
			vc.VelocityX = -constant.MaxVelocityX
		}

		dx := (vc.VelocityX / 3)
		dy := (vc.VelocityY / 3)

		fmt.Printf("TICK: %d, ID: %s, VelX: %d, VelY: %d\n", tick, id, vc.VelocityX, vc.VelocityY)

		if float64(tc.PositionY)+dy < 0 {
			tc.PositionY = 0
			vc.VelocityY = 0
		}

		tc.PrevPositionX = uint16(tc.PositionX)
		tc.PrevPositionY = uint16(tc.PositionY)

		tc.PositionX += uint16(math.Round(dx))
		tc.PositionY += uint16(math.Round(dy))

		fmt.Printf("TICK: %d, ID: %s, X: %d, Y: %d, prevX: %d, prevU: %d \n", tick, id, tc.PositionX, tc.PositionY, tc.PrevPositionX, tc.PrevPositionY)

	}
}
