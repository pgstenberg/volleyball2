package core

import (
	uuid "github.com/satori/go.uuid"
)

type EntityManager struct {
	componentFactory ComponentFactory
	entities         map[string]map[string]*Component
	createdEntities  map[string]map[string]*Component
}

func newEntityManager(componentFactory ComponentFactory) *EntityManager {
	return &EntityManager{
		componentFactory,
		make(map[string]map[string]*Component),
		make(map[string]map[string]*Component),
	}
}

func (em *EntityManager) CreateEntity() string {
	id := uuid.Must(uuid.NewV4()).String()
	em.createdEntities[id] = make(map[string]*Component)
	return id
}

func (em *EntityManager) DeleteEntity(id string) {
	_, ok := em.createdEntities[id]
	if ok {
		delete(em.createdEntities, id)
	}
}

func (em *EntityManager) CreateComponent(id string, cType string) {
	e, ok := em.createdEntities[id]

	if !ok {
		return
	}

	e[cType] = em.componentFactory.Create(cType)

}

func (em *EntityManager) sync() {
	for k, v := range em.createdEntities {
		em.entities[k] = v
	}
	em.createdEntities = make(map[string]map[string]*Component)
}

func (em *EntityManager) DeleteComponent(id string, cType string) {
	_, okE := em.createdEntities[id]
	if !okE {
		return
	}

	_, okC := em.createdEntities[id][cType]

	if okC {
		delete(em.createdEntities[id], cType)
	}

}

func (em *EntityManager) GetComponents(complete bool, cTypes ...string) map[string]map[string]*Component {

	returnMap := make(map[string]map[string]*Component)

	for entityID, c := range em.entities {
		for _, cType := range cTypes {
			_, ok := returnMap[entityID]
			if c[cType] != nil {
				if !ok {
					returnMap[entityID] = make(map[string]*Component)
				}
				returnMap[entityID][cType] = c[cType]
			}else{
				if complete && ok{
					delete(returnMap, entityID)
					break
				}
			}
		}
	}

	return returnMap
}

func (em *EntityManager) EntityExists(id string) bool {
	return em.entities[id] != nil
}

func (em *EntityManager) GetEntityComponents(id string, cTypes ...string) map[string]*Component {
	returnMap := make(map[string]*Component)

	if em.entities[id] == nil {
		return returnMap
	}

	for t, c := range em.entities[id] {
		for _, cType := range cTypes {
			if cType == t {
				returnMap[t] = c
			}
		}
	}

	return returnMap
}
