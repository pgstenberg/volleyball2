class OutStreamSystem extends System {


    update(entityManager: EntityManager, delta: number, tick: number) {

        let components = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.INPUT);

        Object.keys(components)
            .forEach(function(eid){


                let numActiveInput:number = components[eid].input[tick]
                    .filter(Boolean).length;

                
                if(ws_open){
                    let buffer:ArrayBuffer = new ArrayBuffer(3 + numActiveInput);

                    new Uint8Array(buffer, 0, 1)[0] = 1;
                    new Uint16Array(buffer, 2, 2)[0] = tick;

                    let idx;

                    for(idx = 0; idx < components[eid].input[tick].length; idx++){
                        if(components[eid].input[tick][idx]){
                            new Uint8Array(buffer, 4, 1)[0] = idx;
                        }
                    }

                    ws.send(buffer);
                }
            
            });
    }
}