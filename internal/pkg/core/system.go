package core

type System interface {
	Update(entityManager *EntityManager, tick uint16, delta float64)
}
