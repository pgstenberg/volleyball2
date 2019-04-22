class InputSystem extends System {
    update(entityManager, delta, tick) {
        let components = entityManager.getComponents(
            CONSTANTS.COMPONENT.INPUT, 
            CONSTANTS.COMPONENT.TRANSFORM, 
            CONSTANTS.COMPONENT.JUMPING, 
            CONSTANTS.COMPONENT.VELOCITY);

        Object.keys(components)
            .forEach(function(eid){
                components[eid].input[tick] = input;

                if(components[eid].input[tick][INPUT.RIGHT]){

                    if(components[eid].velocity.x < 0){
                        components[eid].velocity.x = 4 * 60;
                    }else{
                        components[eid].velocity.x += 4 * 60;
                    }
                }else if(components[eid].input[tick][INPUT.LEFT]){
                    if(components[eid].velocity.x > 0){
                        components[eid].velocity.x = -4 * 60;
                    }else{
                        components[eid].velocity.x += -4 * 60;
                    }
                }else{
                    if(components[eid].velocity.x > (8*60)){
                        components[eid].velocity.x = components[eid].velocity.x - (4*60);
                    }else if(components[eid].velocity.x < -(8*60)){
                        components[eid].velocity.x = components[eid].velocity.x + (4*60);
                    }else{
                        components[eid].velocity.x = 0;
                    }
                }

                if(components[eid].input[tick][INPUT.JUMP] && 
                        components[eid].transform.y === 0 && 
                        !components[eid].jumping.isJumping){

                    components[eid].velocity.y = 8 * 3 * 60;
                    components[eid].jumping.isJumping = true;
                }

                if(!components[eid].input[tick][INPUT.JUMP]){
                    components[eid].jumping.isJumping = false;
                    if(components[eid].velocity.y > (3 * 60)) {
                        components[eid].velocity.y = 6 * 60;
                    }
                }

            });
    }
}