class RenderSystem extends System {

    _stage: PIXI.Container;

    constructor(stage: PIXI.Container){ 
        super();
        this._stage = stage;

        console.log(">>>>>>>>>>> SETTING STAGE" + stage);
    }
    

    update(_stateManager: StateManager, entityManager: EntityManager, delta: number, tick: number) {
        let components = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.TRANSFORM, 
            CONSTANTS.COMPONENT.GRAPHICS);
        
        let self = this;

        Object.keys(components)
            .forEach(function(eid){

                try {
                    self._stage.getChildIndex(components[eid].graphics)
                }catch(err) {
                    self._stage.addChild(components[eid].graphics);
                }

                components[eid].graphics.x = components[eid].transform.x;
                components[eid].graphics.y = 800 - components[eid].transform.y;


            });
    }
}