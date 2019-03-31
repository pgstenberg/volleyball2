package server

import (
	"time"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server/factory"
	"stonecastle.local/pgstenberg/volleyball/internal/app/server/system"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
)

type Game struct {
	world  *core.World
	ticker *time.Ticker
	tick   uint16
}

func NewGame() *Game {

	w := core.NewWorld(factory.ComponentFactory{}, map[int]core.System{
		10: system.NewNetworkSystem(),
		20: &system.TransformSystem{},
	})

	w.GetEntityManager().CreateComponent(w.GetEntityManager().CreateEntity(), "transform")

	return &Game{
		world:  w,
		ticker: time.NewTicker(time.Second / 60),
	}
}

func (g *Game) Start() {
	go g.loop()
}

func (g *Game) loop() {
	t0 := time.Now().UnixNano()

	for {
		select {
		case <-g.ticker.C:
			t := time.Now().UnixNano()
			// DT in seconds
			delta := float64(t-t0) / 1000000000
			t0 = t
			g.world.Update(g.tick, delta)
			g.tick++
		}
	}

}
