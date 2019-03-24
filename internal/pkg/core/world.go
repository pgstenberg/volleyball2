package core

type World struct {
	entityManager *EntityManager
	systems       []System
}

func NewWorld(componentFactory ComponentFactory, systems []System) *World {

	return &World{
		newEntityManager(componentFactory),
		systems,
	}
}

func (w World) GetEntityManager() *EntityManager {
	return w.entityManager
}

func (w World) Update(delta float64) {
	for _, system := range w.systems {
		system.Update(w.entityManager, delta)
	}
}
