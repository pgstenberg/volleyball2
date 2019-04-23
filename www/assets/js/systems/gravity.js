class GravitySystem extends System {
    update(entityManager, delta, tick) {
        let components = entityManager.getComponents(
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.JUMPING);

        Object.keys(components)
            .forEach(function(eid){

                let g = (!components[eid].jumping.isJumping || components[eid].velocity.y < 0) ? CONSTANTS.PHYSICS.MAX_GRAVITY : CONSTANTS.PHYSICS.MIN_GRAVITY;

                components[eid].velocity.y -= g;
            });
    }
}