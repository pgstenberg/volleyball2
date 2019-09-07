class InStreamSystem extends System {


    update(_stateManager: StateManager, _entityManager: EntityManager, _delta: number, _tick: number) {

        let interpolationComponents = _entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.INTERPOLATION,
            CONSTANTS.COMPONENT.NETWORKING);

        let playerNetworkingComponents = _entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.NETWORKING,
            CONSTANTS.COMPONENT.PLAYER);
        let playerEntityID = Object.keys(playerNetworkingComponents)[0];

        let opponentNetworkingComponents = _entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.NETWORKING,
            CONSTANTS.COMPONENT.OPPONENT);

        while(inStreamBuffer.length > 0){

            let inPackage:{ [key:string]:any; } = inStreamBuffer.pop()

            
            switch(inPackage['type']){
                case 1:

                    console.log("CONNECTION PACKAGE: " + JSON.stringify(inPackage));

                    playerNetworkingComponents[playerEntityID].networking.id = inPackage['player_client_id'];

                    if (inPackage['opponent_client_id'] !== -1) {
                        if(!Object.keys(opponentNetworkingComponents).length){
                            let opponentEntityID = _entityManager.createEntity();

                            _entityManager.createComponent(opponentEntityID, CONSTANTS.COMPONENT.TRANSFORM);
                            _entityManager.createComponent(opponentEntityID, CONSTANTS.COMPONENT.VELOCITY);
                            _entityManager.createComponent(opponentEntityID, CONSTANTS.COMPONENT.NETWORKING).id = inPackage['opponent_client_id'];
                            _entityManager.createComponent(opponentEntityID, CONSTANTS.COMPONENT.INTERPOLATION);
                            _entityManager.createComponent(opponentEntityID, CONSTANTS.COMPONENT.OPPONENT);
                            let g = _entityManager.createComponent(opponentEntityID, CONSTANTS.COMPONENT.GRAPHICS);
                            g.lineStyle(3, 0xffffff);
                            g.arc(0, 0, 50, Math.PI, 0);
                            g.lineTo(-50, 0);
                            g.drawCircle(0, 0, 2);
                        }else{
                            let opponentEntityID = Object.keys(opponentNetworkingComponents)[0];
                            opponentNetworkingComponents[opponentEntityID].networking.id = inPackage['opponent_client_id'];
                        }
                    }
                break;
                case 2:
                    Global.Sync = inPackage['tick'] + Math.round(inPackage['delta'] * (1/60)) + 5;
                break;

                case 3:

                    console.log("INPUT >>>>> " + JSON.stringify(inPackage['state']));

                    Object.keys(inPackage['state'])
                        .map(v => parseInt(v))
                        .forEach(client_id => {

                            if(playerNetworkingComponents[playerEntityID].networking.id === client_id){
                                return;
                            }

                            Object.keys(interpolationComponents)
                                .forEach(function(eid){

                                    if(interpolationComponents[eid].networking.id === client_id){
                                        interpolationComponents[eid].interpolation.x = inPackage['state'][client_id].x;
                                        interpolationComponents[eid].interpolation.y = inPackage['state'][client_id].y;
                                    }
                                });
                        });

                break;

                case 4:

                        let ballComponents = _entityManager.getComponents(
                            true,
                            CONSTANTS.COMPONENT.BALL);

                        Object.keys(inPackage['sync'])
                            .map(v => parseInt(v))
                            .forEach(object_id => {


                            /// SYNC HERE!!!

                            console.log("SYNC " + object_id + " PACKAGE: " + JSON.stringify(inPackage));

                            let ballId = Object.keys(ballComponents)[0];

                            let em = new EntityManager(components);
                            let a = _stateManager.restore(inPackage['tick']);

                            console.log("A COMPONENT " + JSON.stringify(a));

                            em.restore(a)

                            console.log("EID0: " + ballId);
                            
                            let c0 = em.getComponents(
                                true, 
                                CONSTANTS.COMPONENT.TRANSFORM,
                                CONSTANTS.COMPONENT.VELOCITY);

                            console.log("COMPONENT " + JSON.stringify(c0));

                            c0[ballId].transform.x = inPackage['sync'][object_id]['x'];
                            c0[ballId].transform.y = inPackage['sync'][object_id]['y'];
                            c0[ballId].velocity.x = inPackage['sync'][object_id]['vx'];
                            c0[ballId].velocity.y = inPackage['sync'][object_id]['vy'];

                            _stateManager.store(inPackage['tick'], em);

                            Global.Rollback = inPackage['tick'];
                            
                            
                        });
                break;

                case 5:
                    sync_required = true;
                break;
            }
            
    
        }

    }

}