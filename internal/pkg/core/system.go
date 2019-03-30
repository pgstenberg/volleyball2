package core

type System interface {
	ID() string
	Update(entityManager *EntityManager, tick uint16, delta float64)
}
