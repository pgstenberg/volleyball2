class InterpolationSystem extends System {
    update(_game: Game, entityManager: EntityManager, delta: number, tick: number) {
        let components = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.TRANSFORM,
            CONSTANTS.COMPONENT.INTERPOLATION);

        Object.keys(components)
            .forEach(function(eid){

                components[eid].velocity.x = components[eid].interpolation.x - components[eid].transform.x; 
                
                components[eid].velocity.y = components[eid].interpolation.y - components[eid].transform.y;
            });

    }
}