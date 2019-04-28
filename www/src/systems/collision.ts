class CollisionSystem extends System {
    update(entityManager: EntityManager, delta: number, tick: number) {
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
                        

                        if(dist < (50 + 5)){
                            console.log("HIT!" + " DX: " + dx + ", DY:" + dy + ", VY: " + playerComponents[eid].velocity.y);
                            ballComponent[bid].transform.y = playerComponents[eid].transform.y + 50 + 5;
                            ballComponent[bid].velocity.y = Math.min(30, 20 + playerComponents[eid].velocity.y);
                            ballComponent[bid].velocity.x = dx * -1;
                        }

                        
                    });

            });
        
        Object.keys(ballComponent)
            .forEach(function(bid){
                if(ballComponent[bid].transform.x > 800){
                    ballComponent[bid].transform.x = 800;

                    if(ballComponent[bid].velocity.x > 0){
                        ballComponent[bid].velocity.x = ballComponent[bid].velocity.x * -1;
                    }
                }else if(ballComponent[bid].transform.x < 0){
                    ballComponent[bid].transform.x = 0;

                    if(ballComponent[bid].velocity.x < 0){
                        ballComponent[bid].velocity.x = ballComponent[bid].velocity.x * -1;
                    }
                }

                if(ballComponent[bid].transform.y <= 0){
                    ballComponent[bid].transform.y = 0;
                    ballComponent[bid].velocity.x = 0;

                }
            });
    }
}