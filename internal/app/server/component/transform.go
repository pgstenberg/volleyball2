package component

import "stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"

type TransformComponent struct {
	PositionX uint16
	PositionY uint16

	PrevPositionX uint16
	PrevPositionY uint16
}

func (t TransformComponent) ComponenType() string {
	return constant.TransformComponent
}
