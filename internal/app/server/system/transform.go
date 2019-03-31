package system

import (
	"math"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
)

type TransformSystem struct{}

func (ts *TransformSystem) Update(entityManager *core.EntityManager, tick uint16, delta float64) {

	for _, components := range entityManager.GetComponents(constant.VelocityComponent, constant.TransformComponent) {

		if components[constant.VelocityComponent] == nil || components[constant.TransformComponent] == nil {
			continue
		}

		vc := (*components[constant.VelocityComponent]).(*component.VelocityComponent)
		tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

		tc.PositionX = tc.PositionX + uint16(math.Round(vc.VelocityX*delta))
		tc.PositionY = tc.PositionY + uint16(math.Round(vc.VelocityY*delta))

		vc.VelocityX = 0
		vc.VelocityY = 0

	}
}
