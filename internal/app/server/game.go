package server

import (
	"time"

	"stonecastle.local/pgstenberg/volleyball/internal/pkg/core"
)

type Game struct {
	world  *core.World
	ticker *time.Ticker
}

func NewGame() *Game {

	ts := transformSystem{}

	w := core.NewWorld(transformFactory{}, []core.System{ts})

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
			g.world.Update(delta)
		}
	}

}
