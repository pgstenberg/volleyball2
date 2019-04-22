class TransformSystem extends System {
    update(entityManager, delta, tick) {
        let components = entityManager.getComponents(
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.TRANSFORM);

        Object.keys(components)
            .forEach(function(eid){

                let dx = Math.round(components[eid].velocity.x * delta);
                let dy = Math.round(components[eid].velocity.y * delta);

                components[eid].transform.x += dx;

                if(components[eid].velocity.x > (20 * 60)){
                    components[eid].velocity.x = (20 * 60);
                }else if(components[eid].velocity.x < -(20 * 60)){
                    components[eid].velocity.x = -(20 * 60);
                }

                if(components[eid].transform.y + dy < 0){
                    components[eid].transform.y = 0;
                    components[eid].velocity.y = 0;
                }else{
                    components[eid].transform.y  += dy; 
                }

            });
    }
}