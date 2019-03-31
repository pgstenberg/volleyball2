package component

import "stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"

type InputComponent struct {
	Input map[uint16][]bool
}

func (i InputComponent) ComponenType() string {
	return constant.InputComponent
}
