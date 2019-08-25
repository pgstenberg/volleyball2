package component

import "stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"

type PlayerComponent struct {
}

func (pc PlayerComponent) ComponenType() string {
	return constant.PlayerComponent
}