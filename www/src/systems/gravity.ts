class GravitySystem extends System {
    update(entityManager: EntityManager, delta: number, tick: number) {
        let components = entityManager.getComponents(
            false,
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.JUMPING);

        Object.keys(components)
            .forEach(function(eid){

                let g = CONSTANTS.PHYSICS.MIN_GRAVITY / 2;

                if(components[eid].jumping !== undefined){
                    g = (!components[eid].jumping.isJumping || components[eid].velocity.y < 0) ? CONSTANTS.PHYSICS.MAX_GRAVITY : CONSTANTS.PHYSICS.MIN_GRAVITY;
                }
                
                components[eid].velocity.y -= g;
            });
    }
}