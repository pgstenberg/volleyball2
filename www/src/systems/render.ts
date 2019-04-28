class RenderSystem extends System {
    update(entityManager, delta, tick) {
        let components = entityManager.getComponents(
            true,
            CONSTANTS.COMPONENT.TRANSFORM, 
            CONSTANTS.COMPONENT.GRAPHICS);

        Object.keys(components)
            .forEach(function(eid){

                components[eid].graphics.x = components[eid].transform.x;
                components[eid].graphics.y = 800 - components[eid].transform.y;

            });
    }
}