package component

import "stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"

type JumpComponent struct {
	IsJumping bool
}

func (jc JumpComponent) ComponenType() string {
	return constant.JumpComponent
}
