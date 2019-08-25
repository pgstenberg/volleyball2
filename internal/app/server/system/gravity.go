package system

import (
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/core"
)

type GravitySystem struct {
}

func (gs *GravitySystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if pause {
		return
	}

	for _, components := range entityManager.GetComponents(false, constant.TransformComponent, constant.VelocityComponent, constant.JumpComponent) {

		if components[constant.VelocityComponent] == nil {
			return
		}

		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)

		g := constant.MinGravity / 2

		if components[constant.JumpComponent] != nil {
			jc := (*components[constant.JumpComponent]).(*component.JumpComponent)
			vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)

			if !jc.IsJumping || vc.VelocityY < 0 {
				g = constant.MaxGravity
			} else {
				g = constant.MinGravity
			}
		}

		vc.VelocityY -= g

	}
}
