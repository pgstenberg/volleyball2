package system

import (
	"fmt"
	"math"

	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/core"
)

type CollisionSystem struct {
}

func (cs *CollisionSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if pause {
		return
	}

	playerComponent := entityManager.GetComponents(true, constant.VelocityComponent, constant.TransformComponent, constant.PlayerComponent)
	ballComponent := entityManager.GetComponents(true, constant.VelocityComponent, constant.TransformComponent, constant.BallComponent, constant.NetworkComponent)

	/*
		Player with Ball collision stuff
	*/
	for _, pcomponents := range playerComponent {

		pvc := (*pcomponents[constant.VelocityComponent]).(*component.VelocityComponent)
		ptc := (*pcomponents[constant.TransformComponent]).(*component.TransformComponent)

		for beid, bcomponents := range ballComponent {

			bvc := (*bcomponents[constant.VelocityComponent]).(*component.VelocityComponent)
			btc := (*bcomponents[constant.TransformComponent]).(*component.TransformComponent)
			bnc := (*bcomponents[constant.NetworkComponent]).(*component.NetworkComponent)

			bnc.RequireSynchronize = false

			dx := float64(int(ptc.PositionX) - int(btc.PositionX))
			dy := float64(int(ptc.PositionY) - int(btc.PositionY))

			dist := math.Sqrt(dx*dx + dy*dy)

			if dist < (50 + 5 + 6) {
				a0 := float64(0)
				if dx > 0 {
					a0 = -math.Pi
				}
				a := math.Atan(dy/dx) + a0

				fmt.Printf("%d %s    HIT    DX: %04d    DY: %04d    DELTA: %04f\n", tick, beid, dx, dy, dist)

				bnc.RequireSynchronize = true

				btc.PositionY = uint16(math.Round(float64(ptc.PositionY) + (50+5+6)*math.Sin(a)))
				btc.PositionX = uint16(math.Round(float64(ptc.PositionX) + (50+5+6)*math.Cos(a)))
				bvc.VelocityY = math.Min(15, (10 + pvc.VelocityY))
				bvc.VelocityX = float64(dx) * -1
			}
		}

	}

	/*
		Ball Collision Stuff
	*/
	for beid, components := range ballComponent {

		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)
		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)
		bnc := (*components[constant.NetworkComponent]).(*component.NetworkComponent)

		if tc.PositionX > 1200 {
			tc.PositionX = 1200

			fmt.Printf("%d %s    HIT-RIGHT-WALL    X: %04d    Y: %04d\n", tick, beid, tc.PositionX, tc.PositionY)

			bnc.RequireSynchronize = true

			if vc.VelocityX > 0 {
				vc.VelocityX = vc.VelocityX * -1
			}
		} else if tc.PositionX < 0 {
			tc.PositionX = 0

			fmt.Printf("%d %s    HIT-LEFT-WALL    X: %04d    Y: %04d\n", tick, beid, tc.PositionX, tc.PositionY)

			bnc.RequireSynchronize = true

			if vc.VelocityX < 0 {
				vc.VelocityX = vc.VelocityX * -1
			}
			// ROPE COLLISION
		} else if tc.PositionX > 595 &&
			tc.PositionX < 605 &&
			tc.PositionY < 150 {

			fmt.Printf("%d %s    HIT-ROPE    X: %04d    Y: %04d\n", tick, beid, tc.PositionX, tc.PositionY)

			vc.VelocityX = vc.VelocityX * -1
		} else if tc.PositionY <= 50 {
			tc.PositionY = 50
			vc.VelocityX = 0
			vc.VelocityY = 0
		}

	}
}
