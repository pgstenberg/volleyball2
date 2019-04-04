package core

type System interface {
	Update(entityManager *EntityManager, tick uint16, pause bool, delta float64)
}
