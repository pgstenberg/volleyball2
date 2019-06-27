package system

import (
	"fmt"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
)

type InputSystem struct {
}

func (is *InputSystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if pause {
		return
	}

	for id, components := range entityManager.GetComponents(constant.InputComponent, constant.VelocityComponent, constant.JumpComponent, constant.TransformComponent) {
		ic := (*components[constant.InputComponent]).(*component.InputComponent)
		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)
		jc := (*components[constant.JumpComponent]).(*component.JumpComponent)
		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

		if ic.Input[tick] != nil && ic.Input[tick-1] != nil {
			p := false
			for idx, _ := range ic.Input[tick] {
				if ic.Input[tick][idx] != ic.Input[tick-1][idx] {
					p = true
					break
				}
			}
			if p {
				fmt.Printf("TICK: %d, ID: %s, INPUT: %s\n", tick, id, ic.Input[tick])
			}
		}

		if ic.Input[tick] == nil {
			if ic.Input[tick-1] == nil {
				return
			}
			ic.Input[tick] = ic.Input[tick-1]
		}

		/* RIGHT */
		if ic.Input[tick][constant.InputRight] {
			if vc.VelocityX < 0 {
				vc.VelocityX = constant.VelocityX
			} else {
				vc.VelocityX += constant.VelocityX
			}
			/* LEFT */
		} else if ic.Input[tick][constant.InputLeft] {
			if vc.VelocityX > 0 {
				vc.VelocityX = -constant.VelocityX
			} else {
				vc.VelocityX += -constant.VelocityX
			}
			/* NO INPUT */
		} else {
			if vc.VelocityX > (constant.VelocityX * 2) {
				vc.VelocityX = vc.VelocityX - constant.VelocityX
			} else if vc.VelocityX < -(constant.VelocityX * 2) {
				vc.VelocityX = vc.VelocityX + constant.VelocityX
			} else {
				vc.VelocityX = 0
			}
		}

		/*
		*	JUMPING
		 */

		if ic.Input[tick][constant.InputJump] &&
			tc.PositionY == 0 &&
			!jc.IsJumping {

			vc.VelocityY = constant.JumpVelocity
			jc.IsJumping = true
		}
		if !ic.Input[tick][constant.InputJump] {
			jc.IsJumping = false
			if vc.VelocityY > constant.MaxGravity {
				vc.VelocityY = constant.JumpMinVelocity
			}
		}

	}

}
