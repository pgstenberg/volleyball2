

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
    update(_game: Game, _entityManager: EntityManager, _delta: number, _tick: number) {
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

    _stateBuffer: { [key: number]: { [key: string]: { [key: string]: any } } };



    _timestamp(): number {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    update(delta:number){

        this.now = this._timestamp();
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
        while(this.dt > this.step) {
            this.dt = this.dt - this.step;
            
            Object.keys(this._systems)
                .sort((s1,s2) => parseInt(s1) - parseInt(s2))
                .forEach(idx => this._systems[parseInt(idx)].update(this, this._entityManager, delta, this.tick));

            this._stateBuffer[this.tick % 25] = this._entityManager.copy();

            if(this.tick > 100 && (this.tick % 100) === 0){
                console.log("REVERT!!!");
                this._entityManager.restore(this._stateBuffer[(this.tick-20) % 25]);
            }

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
        this._stateBuffer = [];
        this._player_entity_id = playerEntityId;
    }
}

class EntityManager {
    _entities: { [key: string]: { [key: string]: any } } = {};
    _componentFactories: { [key: string]: Function } = {};

    constructor(componentFactories: { [key: string]: Function }){
        this._componentFactories = componentFactories;
    }

    copy(): { [key: string]: { [key: string]: any } } {
        let self = this;

        let copy: { [key: string]: { [key: string]: any } } = {};

        let components = self.getComponents(
            true,
            CONSTANTS.COMPONENT.VELOCITY, 
            CONSTANTS.COMPONENT.TRANSFORM,
            CONSTANTS.COMPONENT.INPUT);

        Object.keys(components).forEach(function(eid) {
            copy[eid] = {};
            Object.keys(components[eid]).forEach(function(c) {
                copy[eid][c] = Object.assign({}, components[eid][c]);
            });
        });

        return copy;
    }

    restore(state: { [key: string]: { [key: string]: any } }){
        let self = this;

        Object.keys(state).forEach(function(eid) {
            Object.keys(state[eid]).forEach(function(c) {
                console.log("EID RESTORE>>>: " + eid + " COMPONENT: " + c);
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

