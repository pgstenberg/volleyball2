class GravitySystem extends System {
    update(entityManager, delta, tick) {
        let components = em.getComponents("velocity", "jumping");

        Object.keys(components)
            .forEach(function(eid){

                let g = (!components[eid].jumping.isJumping || components[eid].velocity.vy < 0) ? (3*60) : (1*60);

                components[eid].velocity.vy -= g;
            });
    }
}