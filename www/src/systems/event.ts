class EventSystem extends System {

    update(_stateManager: StateManager, entityManager: EntityManager, delta: number, tick: number) {

        let events = entityManager
            .getEntityComponents(CONSTANTS.CORE.VOIDENTITY, CONSTANTS.COMPONENT.EVENT).event

        while(events.length){  
            let e = events.pop();

            if(e.type === undefined){
                continue;
            }

            switch(e.type){
                case 'rollback':
                    Global.Rollback = e.rollback;
                break;
            }
        }  
    }

}