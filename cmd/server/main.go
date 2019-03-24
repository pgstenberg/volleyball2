package main

import (
	"stonecastle.local/pgstenberg/volleyball/internal/app/server"
)

func main() {
	g := server.NewGame()
	g.Start()
}
