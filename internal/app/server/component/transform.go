package component

import "stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"

type TransformComponent struct {
	PositionX uint16
	PositionY uint16
}

func (t TransformComponent) ComponenType() string {
	return constant.TransformComponent
}
