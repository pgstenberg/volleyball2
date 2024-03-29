package system

import (
	"fmt"
	"math"

	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/core"
)

type TransformSystem struct{}

func (ts *TransformSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if pause {
		return
	}

	for id, components := range entityManager.GetComponents(false, constant.VelocityComponent, constant.TransformComponent, constant.NetworkComponent) {

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

		if float64(tc.PositionY)+vc.VelocityY < 0 {
			tc.PositionY = 0
			vc.VelocityY = 0
		}

		if tc.PrevPositionX != tc.PositionX || tc.PrevPositionY != tc.PositionY {
			fmt.Printf("%d %s    X: %d    Y: %d   PX: %d   PY: %d   VX %f    VY: %f \n", tick, id, tc.PositionX, tc.PositionY, tc.PrevPositionX, tc.PrevPositionY, vc.VelocityX, vc.VelocityY)
		}

		if components[constant.NetworkComponent] != nil {
			nc := (*components[constant.NetworkComponent]).(*component.NetworkComponent)
			if nc.Interpolate {
				if tc.PrevPositionX != tc.PositionX || tc.PrevPositionY != tc.PositionY {
					nc.RequireInterpolation = true
				} else {
					nc.RequireInterpolation = false
				}
			}
		}

		tc.PrevPositionX = uint16(tc.PositionX)
		tc.PrevPositionY = uint16(tc.PositionY)

		tc.PositionX += uint16(math.Round(vc.VelocityX))
		tc.PositionY += uint16(math.Round(vc.VelocityY))

	}
}
