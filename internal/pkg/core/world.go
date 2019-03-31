package core

import (
	"fmt"
	"sort"
)

type World struct {
	entityManager *EntityManager
	systems       map[int]System
}

func NewWorld(componentFactory ComponentFactory, systems map[int]System) *World {

	return &World{
		newEntityManager(componentFactory),
		systems,
	}
}

func (w *World) GetEntityManager() *EntityManager {
	return w.entityManager
}

func (w *World) Update(tick uint16, delta float64) {

	keys := make([]int, 0)
	for k := range w.systems {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	for _, k := range keys {
		w.systems[k].Update(w.entityManager, tick, delta)
	}
	fmt.Printf("Server Tick:%d\n", tick)
}
