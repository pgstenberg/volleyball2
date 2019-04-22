class TransformSystem extends System {
    update(entityManager, delta, tick) {
        let components = em.getComponents("velocity", "transform");

        Object.keys(components)
            .forEach(function(eid){

                let dx = Math.round(components[eid].velocity.vx * delta);
                let dy = Math.round(components[eid].velocity.vy * delta);

                components[eid].transform.x += dx;

                if(components[eid].velocity.vx > (20 * 60)){
                    components[eid].velocity.vx = (20 * 60);
                }else if(components[eid].velocity.vx < -(20 * 60)){
                    components[eid].velocity.vx = -(20 * 60);
                }

                if(components[eid].transform.y + dy < 0){
                    components[eid].transform.y = 0;
                    components[eid].velocity.vy = 0;
                }else{
                    components[eid].transform.y  += dy; 
                }

            });
    }
}