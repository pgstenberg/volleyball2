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

	for _, components := range entityManager.GetComponents(constant.VelocityComponent, constant.TransformComponent) {

		if components[constant.VelocityComponent] == nil || components[constant.TransformComponent] == nil {
			return
		}

		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)
		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

		dx := int(math.Round(vc.VelocityX * delta))
		dy := int(math.Round(vc.VelocityY * delta))

		tx := int(tc.PositionX)
		ty := int(tc.PositionY)

		tx += dx
		vc.VelocityX = 0

		if ty+dy < 0 {
			ty = 0
			vc.VelocityY = 0
		} else {
			ty += dy
		}

		tc.PrevPositionX = uint16(tc.PositionX)
		tc.PrevPositionY = uint16(tc.PositionY)

		tc.PositionX = uint16(tx)
		tc.PositionY = uint16(ty)

		fmt.Printf("TICK: %d, X: %d, Y: %d, prevX: %d, prevU: %d \n", tick, tc.PositionX, tc.PositionY, tc.PrevPositionX, tc.PrevPositionY)

	}
}
