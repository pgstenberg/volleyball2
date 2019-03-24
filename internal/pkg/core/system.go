package core

type System interface {
	ID() string
	Update(entityManager *EntityManager, delta float64)
}
