package server

import (
	"time"

	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
	"stonecastle.local/pgstenberg/volleyball/internal/pkg/networking"
)

type Game struct {
	world  *core.World
	ticker *time.Ticker
	tick   uint16
}

func NewGame() *Game {

	ts := transformSystem{}
	nis := networkinputSystem{
		server: networking.NewServer(),
	}

	w := core.NewWorld(componentFactory{}, []core.System{ts, nis})

	w.GetEntityManager().CreateComponent(w.GetEntityManager().CreateEntity(), "transform")

	return &Game{
		world:  w,
		ticker: time.NewTicker(time.Second / 60),
	}
}

func (g Game) Start() {
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
