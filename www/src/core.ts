

class Utils {
    static UUID(){
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }    
}

class System {
    update(entityManager: EntityManager, delta, tick) {
        throw new Error('You have to implement this function!');
    }
}

class EntityManager {
    _entities: { [key: string]: { [key: string]: any } }= {};
    _componentFactories: { [key: string]: Function } = {};

    constructor(componentFactories: { [key: string]: Function }){
        this._componentFactories = componentFactories;
    }

    addComponentFactory(cType: string, factory: Function){
        this._componentFactories[cType] = factory;
    }

    createEntity(){
        const id = Utils.UUID();
        this._entities[id] = {};
        return id;
    }

    createComponent(id: string, cType: string){
        let self = this;

        this._entities[id][cType] = self._componentFactories[Object.keys(this._componentFactories).find(function(cf){
            if(cf.split('.').pop().toLowerCase() === cType){
                return cf;
            }
        })]();

        return this._entities[id][cType];
    }

    getEntityComponents(eid: string, ...cType){
        let self = this;
        let rMap = {};
        let fKeys:Array<string> = Object.keys(self._entities[eid]).filter(function(ct){
            return cType.includes(ct);
        });

        if(fKeys.length !== cType.length){
            return rMap;
        }

        fKeys.forEach(function(ct) {
            if(rMap[eid] === undefined){
                rMap[eid] = {};
            }
            rMap[eid][ct] = self._entities[eid][ct];
        })
        return rMap;
    }
    getComponents(complete:boolean = true, ...cType){
        let self = this;
        let rMap = {};
        Object.keys(self._entities).forEach(function(eid) {
            let fKeys:Array<string> = Object.keys(self._entities[eid]).filter(function(ct){
                return cType.includes(ct);
            });

            if(fKeys.length !== cType.length && complete){
                return;
            }

            fKeys.forEach(function(ct) {
                if(rMap[eid] === undefined){
                    rMap[eid] = {};
                }
                rMap[eid][ct] = self._entities[eid][ct];
            })
        });
        return rMap;
    }
};

