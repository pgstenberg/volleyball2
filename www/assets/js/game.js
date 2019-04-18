

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

class EntityManager {
    _entities = {};

    constructor(componentFactories){
        this._componentFactories = componentFactories;
    }

    createEntity(){
        const id = Utils.UUID();
        this._entities[id] = {};
        return id;
    }

    createComponent(id, cType){
        this._entities[id][cType] = this._componentFactories[cType]();
        return this._entities[id][cType];
    }

    getEntityComponents(eid, ...cType){
        let self = this;
        let rMap = {};
        Object.keys(self._entities[eid]).filter(function(ct){
            return cType.includes(ct);
        })
        .forEach(function(ct) {
            if(rMap[eid] === undefined){
                rMap[eid] = {};
            }
            rMap[eid][ct] = self._entities[eid][ct];
        })
        return rMap;
    }
    getComponents(...cType){
        let self = this;
        let rMap = {};
        Object.keys(self._entities).forEach(function(eid) {
            Object.keys(self._entities[eid]).filter(function(ct){
                return cType.includes(ct);
            })
            .forEach(function(ct) {
                if(rMap[eid] === undefined){
                    rMap[eid] = {};
                }
                rMap[eid][ct] = self._entities[eid][ct];
            })
        });
        return rMap;
    }
};

