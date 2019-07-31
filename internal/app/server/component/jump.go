package component

import "stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"

type JumpComponent struct {
	IsJumping bool
}

func (jc JumpComponent) ComponenType() string {
	return constant.JumpComponent
}
