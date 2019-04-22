class RenderSystem extends System {
    update(entityManager, delta, tick) {
        let components = entityManager.getComponents(
            CONSTANTS.COMPONENT.TRANSFORM, 
            CONSTANTS.COMPONENT.GRAPHICS);

        Object.keys(components)
            .forEach(function(eid){
                components[eid].graphics.x = components[eid].transform.x;
                components[eid].graphics.y = 200 - components[eid].transform.y;
            });
    }
}