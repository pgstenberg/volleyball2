class InStreamSystem extends System {


    update(_game: Game, _entityManager: EntityManager, _delta: number, _tick: number) {

        let interpolationComponents = _entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.INTERPOLATION,
            CONSTANTS.COMPONENT.NETWORKING);

        let networkingComponents = _entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.NETWORKING);


        while(inStreamBuffer.length > 0){

            let inPackage:{ [key:string]:any; } = inStreamBuffer.pop()

            switch(inPackage['type']){
                case 1:

                    console.log("CONNECTION PACKAGE: " + JSON.stringify(inPackage));

                    networkingComponents[_game._player_entity_id].networking.id = inPackage['player_client_id'];

                    if (inPackage['opponent_client_id'] !== -1) {
                        if(_game._opponent_entity_id === undefined){
                            _game._opponent_entity_id = _entityManager.createEntity();

                            _entityManager.createComponent(_game._opponent_entity_id, CONSTANTS.COMPONENT.TRANSFORM);
                            _entityManager.createComponent(_game._opponent_entity_id, CONSTANTS.COMPONENT.VELOCITY);
                            _entityManager.createComponent(_game._opponent_entity_id, CONSTANTS.COMPONENT.NETWORKING).id = inPackage['opponent_client_id'];
                            _entityManager.createComponent(_game._opponent_entity_id, CONSTANTS.COMPONENT.INTERPOLATION);
                            let g = _entityManager.createComponent(_game._opponent_entity_id, CONSTANTS.COMPONENT.GRAPHICS);
                            g.lineStyle(3, 0xffffff);
                            g.arc(0, 0, 50, Math.PI, 0);
                            g.lineTo(-50, 0);
                            g.drawCircle(0, 0, 2);
                        }else{
                            networkingComponents[_game._opponent_entity_id].networking.id = inPackage['opponent_client_id'];
                        }
                    }
                break;
                case 2:
                    _game.tick = inPackage['tick'] + Math.round(inPackage['delta'] * (1/60));
                break;

                case 3:

                    console.log("INPUT >>>>> " + JSON.stringify(inPackage['state']));

                    Object.keys(inPackage['state'])
                        .map(v => parseInt(v))
                        .forEach(client_id => {

                            if(networkingComponents[_game._player_entity_id].networking.id === client_id){
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
            }
    
        }

    }

}