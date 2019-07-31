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

                components[eid].input = Global.Input;

                if(ws_open){
                    console.log("TICK: " + tick + ", INPUT: " + components[eid].input);
                }

                if(Global.Input[INPUT.ROLLBACK] && Global.Rollback === undefined){
                    Global.Rollback = tick - 100;
                }

                /* RIGHT */
                if(components[eid].input[INPUT.RIGHT]){
                    if(components[eid].velocity.x < 0){
                        components[eid].velocity.x = CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                    }else{
                        components[eid].velocity.x += CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                    }
                /* LEFT */
                }else if(components[eid].input[INPUT.LEFT]){
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
                if(components[eid].input[INPUT.JUMP] && 
                        components[eid].transform.y === 0 && 
                        !components[eid].jumping.isJumping){

                    components[eid].velocity.y = CONSTANTS.PHYSICS.PLAYER.JUMP_VELOCITY;
                    components[eid].jumping.isJumping = true;
                }

                if(!components[eid].input[INPUT.JUMP]){
                    components[eid].jumping.isJumping = false;
                    if(components[eid].velocity.y > CONSTANTS.PHYSICS.MAX_GRAVITY) {
                        components[eid].velocity.y = CONSTANTS.PHYSICS.PLAYER.JUMP_MIN_VELOCITY;
                    }
                }

            });
    }
}