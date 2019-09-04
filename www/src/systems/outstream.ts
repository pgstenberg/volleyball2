class OutStreamSystem extends System {


    update(_stateManager: StateManager, entityManager: EntityManager, delta: number, tick: number) {

        let components = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.INPUT);

        function getInt64Bytes(x:number) {
            let y= x/2**32;
            return [y,(y<<8),(y<<16),(y<<24), x,(x<<8),(x<<16),(x<<24)].map(z=> z>>>24)
        }

        Object.keys(components)
            .forEach(function(eid){

                let numActiveInput:number = Array.from(components[eid].input.d).filter(Boolean).length;

                if(ws_open){
                    let buffer:DataView = new DataView(new ArrayBuffer(3 + numActiveInput))

                    buffer.setUint8(0, 1);

                    let tickBytes = getInt64Bytes(tick);

                    buffer.setUint8(1, tickBytes[tickBytes.length-1]);
                    buffer.setUint8(2, tickBytes[tickBytes.length-2]);

                    let inputIdx;
                    let idx=0;

                    for(inputIdx = 0; inputIdx < components[eid].input.d.length; inputIdx++){
                        if(components[eid].input.d[inputIdx]){
                            buffer.setInt8(3+idx, inputIdx);
                            idx++;
                        }
                    }

                    ws.send(buffer.buffer);


                    if(sync_required){
                        let buffer:DataView = new DataView(new ArrayBuffer(1));
                        buffer.setUint8(0,2);
                
                        t0 = (window.performance && window.performance.now ? window.performance.now() : new Date().getTime());
                        ws.send(buffer.buffer);

                        sync_required = false;
                    }
                }
            
            });
    }
}