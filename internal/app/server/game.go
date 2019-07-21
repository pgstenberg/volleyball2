package server

import (
	"time"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/component"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/constant"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/factory"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/system"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/networking"
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

	w := core.NewWorld(factory.ComponentFactory{}, map[int]core.System{
		10:  system.NewConnectSystem(server, clients),
		20:  system.NewInstreamSystem(server, clients),
		30:  &system.InputSystem{},
		40:  &system.GravitySystem{},
		100: &system.TransformSystem{},
		200: system.NewOutstreamSystem(server, clients),
	})

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
				for _, components := range entityManager.GetComponents(constant.InputComponent) {
					ic := (*components[constant.InputComponent]).(*component.InputComponent)
					if ic.Input[tick] == nil {
						//g.numSkipedTicks++
						return true
					}
				}
				//g.numSkipedTicks = 0
				return false
			}, delta) {
				g.tick++
			}

		}
	}

}
