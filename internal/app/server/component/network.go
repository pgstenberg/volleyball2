package component

import "stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"

type NetworkComponent struct {
	Interpolate bool
	Synchronize bool
	RequireInterpolation bool
	RequireSynchronize bool
}

func (nc NetworkComponent) ComponenType() string {
	return constant.NetworkComponent
}