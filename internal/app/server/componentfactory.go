package server

import "stonecastle.local/pgstenberg/volleyball/internal/pkg/core"

type componentFactory struct{}

func (tf componentFactory) Create(cType string) *core.Component {

	switch cType {
	case "transform":
		var c core.Component = &transformComponent{
			positionX: uint16(0),
			positionY: uint16(0),
		}
		return &c

	case "input":

		var c core.Component = &inputComponent{
			input: []bool{false, false, false},
			tick:  uint16(0),
		}
		return &c

	default:
		return nil
	}
}
