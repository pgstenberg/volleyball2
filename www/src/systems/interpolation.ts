class InterpolationSystem extends System {
    update(_game: Game, entityManager: EntityManager, delta: number, tick: number) {
        let components = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.TRANSFORM,
            CONSTANTS.COMPONENT.INTERPOLATION);

        Object.keys(components)
            .forEach(function(eid){

                if(ws_open){
                    console.log(">>>> " + eid + "  X: " + components[eid].interpolation.x);
                }

                /*
                if(components[eid].transform.x < components[eid].interpolation.x){
                    components[eid].velocity.x = 5; 
                }else if(components[eid].transform.x > components[eid].interpolation.x){
                    components[eid].velocity.x = -5; 
                }
                */
            });

    }
}