class TransformSystem extends System {
    update(_stateManager: StateManager, entityManager: EntityManager, delta: number, tick: number) {
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

                if(ws_open){
                    console.log("TICK: " + tick + ", X: " + components[eid].transform.x + ", Y: " + components[eid].transform.y + ", VX: " + components[eid].velocity.x + ", VY: " + components[eid].velocity.y);
                }

                
                //components[eid].transform.x += Math.round(components[eid].velocity.x);
                //components[eid].transform.y += Math.round(components[eid].velocity.y);

                // NEED TO ROUND IN A VERY WEIRD WAY HERE, FU JS
                components[eid].transform.x += Math.sign(components[eid].velocity.x) * Math.round(Math.abs(components[eid].velocity.x));
                components[eid].transform.y += Math.sign(components[eid].velocity.y) * Math.round(Math.abs(components[eid].velocity.y));
                

                


            });
    }
}