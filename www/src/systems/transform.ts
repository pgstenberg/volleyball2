class TransformSystem extends System {
    update(entityManager, delta, tick) {
        let components = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.TRANSFORM);

        Object.keys(components)
            .forEach(function(eid){

                if(components[eid].velocity.x > CONSTANTS.PHYSICS.PLAYER.MAX_VELOCITY_X) {
                    components[eid].velocity.x = CONSTANTS.PHYSICS.PLAYER.MAX_VELOCITY_X;
                }else if(components[eid].velocity.x < -CONSTANTS.PHYSICS.PLAYER.MAX_VELOCITY_X) {
                    components[eid].velocity.x = -CONSTANTS.PHYSICS.PLAYER.MAX_VELOCITY_X;
                }

                if(components[eid].transform.y + components[eid].velocity.y < 0){
                    components[eid].transform.y = 0;
                    components[eid].velocity.y = 0;
                }

                components[eid].transform.x += components[eid].velocity.x;
                components[eid].transform.y += components[eid].velocity.y;



            });
    }
}