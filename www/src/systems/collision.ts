class CollisionSystem extends System {

    update(_stateManager: StateManager, entityManager: EntityManager, delta: number, tick: number) {
        let playerComponents = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.TRANSFORM,
            CONSTANTS.COMPONENT.JUMPING);
        
        let ballComponent = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.TRANSFORM,
            CONSTANTS.COMPONENT.BALL);

        Object.keys(playerComponents)
            .forEach(function(eid){

                Object.keys(ballComponent)
                    .forEach(function(bid){

                        let dx = playerComponents[eid].transform.x - ballComponent[bid].transform.x;
                        let dy = playerComponents[eid].transform.y - ballComponent[bid].transform.y;

                        // Distance from ball to player
                        let dist = Math.sqrt(dx*dx + dy*dy);
                        
                        if(dist < (50 + 5 + 6)){


                            let a = Math.atan(dy/dx) + (Math.sign(dx) === 1 ? -Math.PI : 0);

                            console.log("TICK " + tick + " HIT!" + " DX: " + dx + ", DY:" + dy + ", VY: " + playerComponents[eid].velocity.y + ", DIST: " + dist + " ANGLE1: " + a + ", X:" + playerComponents[eid].transform.x + ", Y: " + playerComponents[eid].transform.y + ", X1:" + ballComponent[bid].transform.x + ", Y1:" + ballComponent[bid].transform.y);

                            ballComponent[bid].transform.y = Math.round(playerComponents[eid].transform.y + (50 + 5 + 6) * Math.sin(a));
                            ballComponent[bid].transform.x = Math.round(playerComponents[eid].transform.x + (50 + 5 + 6) * Math.cos(a));
                            ballComponent[bid].velocity.y = Math.min(15, (10 + playerComponents[eid].velocity.y));
                            ballComponent[bid].velocity.x = dx * -1;
                        }

                        
                    });

            });
        
        Object.keys(ballComponent)
            .forEach(function(bid){

                if(ballComponent[bid].transform.x > 1200){
                    ballComponent[bid].transform.x = 1200;

                    console.log("RIGHT WALL HIT!");

                    if(ballComponent[bid].velocity.x > 0){
                        ballComponent[bid].velocity.x = ballComponent[bid].velocity.x * -1;
                    }
                }else if(ballComponent[bid].transform.x < 0){
                    ballComponent[bid].transform.x = 0;

                    
                    console.log("LEFT WALL HIT!");

                    if(ballComponent[bid].velocity.x < 0){
                        ballComponent[bid].velocity.x = ballComponent[bid].velocity.x * -1;
                    }
                
                // ROPE COLLISION
                }else if(ballComponent[bid].transform.x > 595 && 
                        ballComponent[bid].transform.x < 605 && 
                        ballComponent[bid].transform.y < 150){

                    
                    console.log("ROPE HIT!");
                    ballComponent[bid].velocity.x = ballComponent[bid].velocity.x * -1;
                }

                // FLOOR COLLISION
                if(ballComponent[bid].transform.y <= 0){
                    ballComponent[bid].transform.y = 400;
                    ballComponent[bid].velocity.x = 0;
                    ballComponent[bid].velocity.y = 0;

                }
            });
    }
}