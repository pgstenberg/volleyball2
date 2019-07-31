class Global {
    static _input: boolean[] = [false, false, false];
    static _rollback: number = undefined;
    static _sync: number = undefined;

    static get Input(): boolean[]{
        let self = this;
        return self._input;
    };
    static set Input(input: boolean[]){
        let self = this;
        self._input = input;
    };

    static get Rollback(): number {
        let self = this;
        return self._rollback;
    }
    static set Rollback(rollback: number){
        let self = this;
        self._rollback = rollback;
    }

    static get Sync(): number {
        let self = this;
        return self._sync;
    }
    static set Sync(sync: number){
        let self = this;
        self._sync = sync;
    }
}