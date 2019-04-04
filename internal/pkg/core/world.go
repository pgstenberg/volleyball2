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

type IsPaused func(entityManager *EntityManager, tick uint16) bool

func (w *World) Update(tick uint16, isPaused IsPaused, delta float64) bool {

	pause := isPaused(w.entityManager, tick)

	if pause {
		fmt.Printf("!!!!!!!!!! PAUSE !!!!!!!!!!\n")
	}

	keys := make([]int, 0)
	for k := range w.systems {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	for _, k := range keys {
		w.systems[k].Update(w.entityManager, tick, pause, delta)
	}

	w.entityManager.sync()

	return !pause
}
