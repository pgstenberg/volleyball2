package system

import (
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/core"
	"math"
	"fmt"
)

type CollisionSystem struct {
}

func (cs *CollisionSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if pause {
		return
	}

	playerComponent := entityManager.GetComponents(true, constant.VelocityComponent, constant.TransformComponent, constant.PlayerComponent)
	ballComponent := entityManager.GetComponents(true, constant.VelocityComponent, constant.TransformComponent, constant.BallComponent)

	/*
	Player with Ball collision stuff
	*/
	for _, pcomponents := range playerComponent {

		pvc := (*pcomponents[constant.VelocityComponent]).(*component.VelocityComponent)
		ptc := (*pcomponents[constant.TransformComponent]).(*component.TransformComponent)

		for _, bcomponents := range ballComponent {

			bvc := (*bcomponents[constant.VelocityComponent]).(*component.VelocityComponent)
			btc := (*bcomponents[constant.TransformComponent]).(*component.TransformComponent)
	
			dx := float64(ptc.PositionX - btc.PositionX)
			dy := float64(ptc.PositionY - btc.PositionY)

			dist := math.Sqrt(dx*dx + dy*dy)

			fmt.Printf("DIST>>>>>>>>> %d",dist)

			if (dist < (50 + 5 + 6)){
				a0 := float64(0)
				if dx > 0 {
					a0 = -math.Pi
				}
				a := math.Atan(dy/dx) + a0


				btc.PositionY = ptc.PositionY + uint16((50 + 5 + 6) * math.Sin(a));
				btc.PositionX = ptc.PositionX + uint16((50 + 5 + 6) * math.Cos(a));
				bvc.VelocityY = math.Min(15, (10 + pvc.VelocityY));
				bvc.VelocityX = float64(dx) * -1;
			}
		}

	}

	/*
	Ball Collision Stuff
	*/
	for _, components := range ballComponent {

		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)
		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

		if tc.PositionX > 1200 {
			tc.PositionX = 1200

			if vc.VelocityX > 0 {
				vc.VelocityX = vc.VelocityX * -1;
			}
		}else if tc.PositionX < 0 {
			tc.PositionX = 0

			if vc.VelocityX < 0 {
				vc.VelocityX = vc.VelocityX * -1;
			}
		// ROPE COLLISION
		} else if (tc.PositionX > 595 && 
			tc.PositionX < 605 && 
			tc.PositionY < 150) {
		vc.VelocityX = vc.VelocityX * -1;
	}

	// FLOOR COLLISION
	if tc.PositionY <= 0 {
		tc.PositionY = 0;
		vc.VelocityX = 0;
	}

	}
}