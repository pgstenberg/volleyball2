package server

import (
	"time"

	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/factory"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server/system"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/pkg/networking"
)

type Game struct {
	world          *core.World
	ticker         *time.Ticker
	tick           uint16
	numSkipedTicks int
	clients        map[uint8]string
}

func NewGame() *Game {

	server := networking.CreateServer()
	clients := make(map[uint8]string)
	objects := make(map[uint8]string)

	w := core.NewWorld(factory.ComponentFactory{}, map[int]core.System{
		10:  system.NewConnectSystem(server, clients),
		20:  system.NewInstreamSystem(server, clients),
		30:  &system.InputSystem{},
		40:  &system.GravitySystem{},
		50:  &system.TransformSystem{},
		60:  &system.CollisionSystem{},
		200: system.NewOutstreamSystem(server, clients, objects),
	})

	// Create ball entity
	ballEntity := w.GetEntityManager().CreateEntity()
	w.GetEntityManager().CreateComponent(ballEntity, constant.VelocityComponent)
	w.GetEntityManager().CreateComponent(ballEntity, constant.TransformComponent)
	w.GetEntityManager().CreateComponent(ballEntity, constant.BallComponent)
	w.GetEntityManager().CreateComponent(ballEntity, constant.NetworkComponent)

	w.GetEntityManager().Sync()

	//components := w.GetEntityManager().GetEntityComponents(ballEntity, constant.TransformComponent)
	//tc := (*components[constant.TransformComponent]).(*component.TransformComponent)

	tc := (*w.GetEntityManager().GetEntityComponents(ballEntity, constant.TransformComponent)[constant.TransformComponent]).(*component.TransformComponent)
	nc := (*w.GetEntityManager().GetEntityComponents(ballEntity, constant.NetworkComponent)[constant.NetworkComponent]).(*component.NetworkComponent)
	nc.Synchronize = true

	tc.PositionX = 400
	tc.PositionY = 800

	objects[10] = ballEntity


	return &Game{
		world:          w,
		ticker:         time.NewTicker(time.Second / 60),
		tick:           uint16(1),
		numSkipedTicks: 0,
		clients:        clients,
	}
}

func (g *Game) Start() {
	go g.loop()
}

func (g *Game) loop() {
	//t0 := time.Now().UnixNano()

	const delta float64 = float64(float64(1) / float64(60))

	for {
		select {
		case <-g.ticker.C:
			//t := time.Now().UnixNano()
			// DT in seconds
			//delta := float64(t-t0) / 1000000000
			//t0 = t

			if g.world.Update(g.tick, func(entityManager *core.EntityManager, tick uint16) bool {
				/*
					if g.numSkipedTicks >= 3 {
						g.numSkipedTicks = 0
						return false
					}
				*/
				/*
				for _, components := range entityManager.GetComponents(true, constant.InputComponent) {
					ic := (*components[constant.InputComponent]).(*component.InputComponent)
					
					if ic.Input[tick] == nil {
						g.numSkipedTicks++
						return true
					}
					
				}
				g.numSkipedTicks = 0
				*/
				return false
			}, delta) {
				g.tick++
			}

		}
	}

}
