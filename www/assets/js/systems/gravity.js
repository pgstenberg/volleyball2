class GravitySystem extends System {
    update(entityManager, delta, tick) {
        let components = entityManager.getComponents(
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.JUMPING);

        Object.keys(components)
            .forEach(function(eid){

                let g = (!components[eid].jumping.isJumping || components[eid].velocity.y < 0) ? (3*60) : (1*60);

                components[eid].velocity.y -= g;
            });
    }
}