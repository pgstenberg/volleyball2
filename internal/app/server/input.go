package server

type inputComponent struct {
	input []bool
	tick  uint16
}

func (i inputComponent) ComponenType() string {
	return "input"
}
