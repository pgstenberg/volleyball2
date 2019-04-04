package system

import (
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
)

type GravitySystem struct {
}

func (gs *GravitySystem) Update(entityManager *core.EntityManager, tick uint16, pause bool, delta float64) {

	if pause {
		return
	}

	for _, components := range entityManager.GetComponents(constant.TransformComponent, constant.VelocityComponent) {

		if components[constant.VelocityComponent] == nil {
			return
		}

		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)

		vc.VelocityY -= (4 * 60)

	}
}
