package core

type Component interface {
	ComponenType() string
}

type ComponentFactory interface {
	Create(cType string) *Component
}
