package system

import (
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

	for _, components := range entityManager.GetComponents(constant.InputComponent, constant.VelocityComponent, constant.JumpComponent, constant.TransformComponent) {
		ic := (*components[constant.InputComponent]).(*component.InputComponent)
		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)
		jc := (*components[constant.JumpComponent]).(*component.JumpComponent)
		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

		if ic.Input[tick] == nil {
			return
		}

		if ic.Input[tick][constant.InputLeft] {
			vc.VelocityX = -4 * 60
		} else if ic.Input[tick][constant.InputRight] {
			vc.VelocityX = 4 * 60
		}

		if ic.Input[tick][constant.InputJump] && tc.PositionY == 0 && !jc.IsJumping {
			vc.VelocityY = 14 * 3 * 60
			jc.IsJumping = true
		}

		if !ic.Input[tick][constant.InputJump] {
			jc.IsJumping = false
			if vc.VelocityY > (3 * 60) {
				vc.VelocityY = 3 * 60
			}
		}

	}

}
