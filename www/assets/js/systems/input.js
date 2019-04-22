class InputSystem extends System {
    update(entityManager, delta, tick) {
        let components = em.getComponents("input", "transform", "jumping", "velocity");

        Object.keys(components)
            .forEach(function(eid){
                components[eid].input[tick] = input;

                if(components[eid].input[tick][INPUT.RIGHT]){

                    if(components[eid].velocity.vx < 0){
                        components[eid].velocity.vx = 4 * 60;
                    }else{
                        components[eid].velocity.vx += 4 * 60;
                    }
                }else if(components[eid].input[tick][INPUT.LEFT]){
                    if(components[eid].velocity.vx > 0){
                        components[eid].velocity.vx = -4 * 60;
                    }else{
                        components[eid].velocity.vx += -4 * 60;
                    }
                }else{
                    if(components[eid].velocity.vx > (8*60)){
                        components[eid].velocity.vx = components[eid].velocity.vx - (4*60);
                    }else if(components[eid].velocity.vx < -(8*60)){
                        components[eid].velocity.vx = components[eid].velocity.vx + (4*60);
                    }else{
                        components[eid].velocity.vx = 0;
                    }
                }

                if(components[eid].input[tick][INPUT.JUMP] && 
                        components[eid].transform.y === 0 && 
                        !components[eid].jumping.isJumping && 
                        components[eid].jumping.cooldown === 0){

                    components[eid].velocity.vy = 8 * 3 * 60;
                    components[eid].jumping.isJumping = true;
                }

                if(!components[eid].input[tick][INPUT.JUMP]){
                    /*
                    if(components[eid].jumping.cooldown > 0 && components[eid].transform.y === 0){
                        components[eid].jumping.cooldown = components[eid].jumping.cooldown - 1;
                    }

                    if(components[eid].jumping.isJumping){
                        components[eid].jumping.cooldown = 5;
                    }
                    */
                    components[eid].jumping.isJumping = false;
                    if(components[eid].velocity.vy > (3 * 60)) {
                        components[eid].velocity.vy = 6 * 60;
                    }
                }

            });
    }
}