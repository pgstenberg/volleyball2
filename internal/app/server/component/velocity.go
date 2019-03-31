package component

import "stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"

type VelocityComponent struct {
	VelocityX float64
	VelocityY float64
}

func (t VelocityComponent) ComponenType() string {
	return constant.VelocityComponent
}
