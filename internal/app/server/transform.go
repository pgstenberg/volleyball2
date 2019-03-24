package server

import (
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
)

type transformComponent struct {
	positionX uint16
	positionY uint16
}

type transformSystem struct{}
type transformFactory struct{}

func (t transformComponent) ComponenType() string {
	return "transform"
}

func (ts transformSystem) Update(entityManager *core.EntityManager, delta float64) {

	for _, c := range entityManager.GetComponents("transform") {
		a := (*c["transform"]).(*transformComponent)
		a.positionX += uint16(150 * delta)
	}
}
func (ts transformSystem) ID() string {
	return "TransformSystem"
}

func (tf transformFactory) Create(cType string) *core.Component {
	var c core.Component = &transformComponent{
		positionX: uint16(0),
		positionY: uint16(0),
	}
	return &c
}
