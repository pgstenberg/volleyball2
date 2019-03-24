package core

import (
	uuid "github.com/satori/go.uuid"
)

type EntityManager struct {
	componentFactory ComponentFactory
	components       map[string]map[string]*Component
}

func newEntityManager(componentFactory ComponentFactory) *EntityManager {
	return &EntityManager{
		componentFactory,
		make(map[string]map[string]*Component),
	}
}

func (em EntityManager) CreateEntity() string {
	id := uuid.Must(uuid.NewV4()).String()
	em.components[id] = make(map[string]*Component)
	return id
}

func (em EntityManager) DeleteEntity(id string) {
	_, ok := em.components[id]
	if ok {
		delete(em.components, id)
	}
}

func (em EntityManager) CreateComponent(id string, cType string) {
	e, ok := em.components[id]

	if !ok {
		return
	}

	e[cType] = em.componentFactory.Create(cType)

}

func (em EntityManager) DeleteComponent(id string, cType string) {
	_, okE := em.components[id]
	if !okE {
		return
	}

	_, okC := em.components[id][cType]

	if okC {
		delete(em.components[id], cType)
	}

}

func (em EntityManager) GetComponents(cTypes ...string) map[string]map[string]*Component {

	returnMap := make(map[string]map[string]*Component)

	for entityID, c := range em.components {
		for _, cType := range cTypes {
			if c[cType] != nil {
				if returnMap[entityID] == nil {
					returnMap[entityID] = make(map[string]*Component)
				}
				returnMap[entityID][cType] = c[cType]
			}
		}
	}

	return returnMap
}
