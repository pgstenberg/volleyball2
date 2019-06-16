class InStreamSystem extends System {


    update(entityManager: EntityManager, delta: number, tick: number) {


        while(inStreamBuffer.length > 0){

            let inPackage:{ [key:string]:any; } = inStreamBuffer.pop()

            switch(inPackage['type']){
                case 2:
                    tick = inPackage['tick'] + (inPackage['delta'] * (1/60));
                break;
            }
    
        }

    }

}