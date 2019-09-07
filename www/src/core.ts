

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
    update(_stateManager: StateManager, _entityManager: EntityManager, _delta: number, _tick: number) {
        throw new Error('You have to implement this function!');
    }
}

class Game {
    now: number;
    dt: number;
    last: number;
    tick: number;

    _player_entity_id: string;
    _opponent_entity_id: string = undefined;

    step:number = 1/60;

    _systems: { [key: number]: System }
    _entityManager: EntityManager

    _stateManager: StateManager

    _timestamp(): number {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    _updateSystems(delta:number, tick:number){
        Object.keys(this._systems)
            .sort((s1,s2) => parseInt(s1) - parseInt(s2))
            .forEach(idx => this._systems[parseInt(idx)].update(this._stateManager, this._entityManager, delta, tick));
    }

    update(delta:number){

        this.now = this._timestamp();
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
        while(this.dt > this.step) {
            this.dt = this.dt - this.step;

            if(Global.Rollback !== undefined){
                console.log("-----> ROLLBACK " + Global.Rollback);
                while(Global.Rollback < this.tick){
                    this._entityManager.restore(this._stateManager.restore(Global.Rollback));
                    this._updateSystems(delta, Global.Rollback);
                    Global.Rollback = Global.Rollback + 1;
                }
                Global.Rollback = undefined;
            }

            if(Global.Sync !== undefined){
                this.tick = Global.Sync;
                Global.Sync = undefined;

                console.log("TICK!!!! " + this.tick);
            }
            
            this._updateSystems(delta, this.tick);

            this._stateManager.store(this.tick, this._entityManager);

            this.tick = this.tick + 1;
        }
        this.last = this.now;
    }


    constructor(systems: { [key: number]: System }, entityManager: EntityManager, playerEntityId: string){ 
        this.dt = 0;
        this.now = this._timestamp();
        this.last = this._timestamp();
        this.tick = 0;
        this._systems = systems;
        this._entityManager = entityManager;
        this._stateManager = new StateManager();
        this._player_entity_id = playerEntityId;
    }
}

class StateManager {
    _state: { [key: string]: { [key: string]: any } }[] = [];

    store(tick: number, entityManager: EntityManager) {
        let self = this;
        self._state[tick % CONSTANTS.CORE.STATEBUFFERSIZE] = entityManager.copy();
    }

    restore(tick: number, ...filter: string[]): { [key: string]: { [key: string]: any } }{
        let self = this;
        if(!filter.length){
            return self._state[tick % CONSTANTS.CORE.STATEBUFFERSIZE];
        }

        let r: { [key: string]: { [key: string]: any } } = {};

        Object.keys(self._state[tick % CONSTANTS.CORE.STATEBUFFERSIZE]).forEach(function(eid){
            Object.keys(self._state[tick % CONSTANTS.CORE.STATEBUFFERSIZE][eid]).forEach(function(c) {
                if(filter.indexOf(c) !== -1 || !filter.length){
                    if(r[eid] === undefined){
                        r[eid] = {};
                    }

                    r[eid][c] = self._state[tick % CONSTANTS.CORE.STATEBUFFERSIZE][eid][c];
                }
            });
        });

        return r;
    }
}

class EntityManager {
    _entities: { [key: string]: { [key: string]: any } } = {};
    _componentFactories: { [key: string]: Function } = {};

    constructor(componentFactories: { [key: string]: Function }){
        this._componentFactories = componentFactories;

        this._entities[CONSTANTS.CORE.VOIDENTITY] = {};
    }

    copy(): { [key: string]: { [key: string]: any } } {
        let self = this;

        let copy: { [key: string]: { [key: string]: any } } = {};

        let components = self.getComponents(
            false,
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.TRANSFORM,
            CONSTANTS.COMPONENT.INPUT);

        Object.keys(components).forEach(function(eid) {
            copy[eid] = {};
            Object.keys(components[eid]).forEach(function(c) {
                if(typeof components[eid][c] !== 'undefined'){
                    ///console.log("COPY " + eid + " === " + JSON.stringify(components[eid][c]));
                    copy[eid][c] = Object.assign({}, components[eid][c]);
                }
            });
        });

        return copy;
    }

    restore(state: { [key: string]: { [key: string]: any } }){
        let self = this;

        Object.keys(state).forEach(function(eid) {
            Object.keys(state[eid]).forEach(function(c) {
                if(!(eid in self._entities)){
                    self._entities[eid] = {};
                }

                self._entities[eid][c] = Object.assign({}, state[eid][c]);
            });
        });

    }

    getComponentFactories(): { [key: string]: Function } {
        let self = this;
        return self._componentFactories;
    }

    addComponentFactory(cType: string, factory: Function){
        this._componentFactories[cType] = factory;
    }

    createEntity(): string {
        const id = Utils.UUID();
        this._entities[id] = {};
        return id;
    }

    createComponent(id: string, cType: string): any {
        let self = this;

        let cf: string = Object.keys(this._componentFactories).find(function(cf){
            if(cf.split('.').pop().toLowerCase() === cType){
                return true;
            }
            return false;
        });

        this._entities[id][cType] = self._componentFactories[cf]();

        return this._entities[id][cType];
    }

    getEntityComponents(eid: string, ...cType: string[]) {
        let self = this;
        let rMap: { [key: string]: { [key: string]: any } } = {};

        let fKeys:Array<string> = Object.keys(self._entities[eid]).filter(function(ct){
            return cType.indexOf(ct) !== -1;
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
    getComponents(complete: boolean = true, ...cType: string[]) {
        let self = this;
        let rMap: { [key: string]: { [key: string]: any } } = {};
        Object.keys(self._entities).forEach(function(eid) {
            let fKeys:Array<string> = Object.keys(self._entities[eid]).filter(function(ct){
                // Check if component type match any in cType or if none where given.
                return cType.indexOf(ct) !== -1 || cType.length === 0;
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

