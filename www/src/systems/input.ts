class InputSystem extends System {
    update(_stateManager: StateManager, entityManager: EntityManager, delta: number, tick: number) {
        let components = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.INPUT, 
            CONSTANTS.COMPONENT.TRANSFORM, 
            CONSTANTS.COMPONENT.JUMPING, 
            CONSTANTS.COMPONENT.VELOCITY);


        let idx = 0;

        Object.keys(components)
            .forEach(function(eid){

                if(Global.Rollback === undefined){
                    components[eid].input.d = Array.from(Global.Input);
                }

                if(ws_open){
                    console.log("TICK: " + tick + ", ID: " + eid + " , INPUT: " + components[eid].input.d);
                }

                /* RIGHT */
                if(components[eid].input.d[INPUT.RIGHT]){
                    if(components[eid].velocity.x < 0){
                        components[eid].velocity.x = CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                    }else{
                        components[eid].velocity.x += CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                    }
                /* LEFT */
                }else if(components[eid].input.d[INPUT.LEFT]){
                    if(components[eid].velocity.x > 0){
                        components[eid].velocity.x = -CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                    }else{
                        components[eid].velocity.x += -CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                    }
                /* NO INPUT */
                }else{
                    if(components[eid].velocity.x > (CONSTANTS.PHYSICS.PLAYER.VELOCITY_X * 2)) {
                        components[eid].velocity.x = components[eid].velocity.x - CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                    }else if(components[eid].velocity.x < -(CONSTANTS.PHYSICS.PLAYER.VELOCITY_X * 2)) {
                        components[eid].velocity.x = components[eid].velocity.x + CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                    }else{
                        components[eid].velocity.x = 0;
                    }
                }

                /*
                    JUMPING MECHANICS
                */
                if(components[eid].input.d[INPUT.JUMP] && 
                        components[eid].transform.y === 0 && 
                        !components[eid].jumping.isJumping){

                    components[eid].velocity.y = CONSTANTS.PHYSICS.PLAYER.JUMP_VELOCITY;
                    components[eid].jumping.isJumping = true;
                }

                if(!components[eid].input.d[INPUT.JUMP]){
                    components[eid].jumping.isJumping = false;
                    if(components[eid].velocity.y > CONSTANTS.PHYSICS.MAX_GRAVITY) {
                        components[eid].velocity.y = CONSTANTS.PHYSICS.PLAYER.JUMP_MIN_VELOCITY;
                    }
                }

            });
    }
}