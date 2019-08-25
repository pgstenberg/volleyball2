package component

import "stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"

type BallComponent struct {
}

func (bc BallComponent) ComponenType() string {
	return constant.BallComponent
}