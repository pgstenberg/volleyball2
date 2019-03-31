package factory

import (
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
)

type ComponentFactory struct{}

func (tf ComponentFactory) Create(cType string) *core.Component {

	switch cType {

	case constant.TransformComponent:
		var c core.Component = &component.TransformComponent{
			PositionX: uint16(0),
			PositionY: uint16(0),
		}
		return &c

	case constant.VelocityComponent:
		var c core.Component = &component.VelocityComponent{
			VelocityX: float64(0),
			VelocityY: float64(0),
		}
		return &c

	case constant.InputComponent:

		var c core.Component = &component.InputComponent{
			Input: make(map[uint16][]bool),
		}
		return &c

	default:
		return nil
	}
}
