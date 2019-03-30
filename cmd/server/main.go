package main

import (
	"flag"
	"log"
	"net/http"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server"
)

func main() {
	addr := flag.String("addr", s.Bind, "http service address")

	g := server.NewGame()
	g.Start()

	err := http.ListenAndServe(*addr, nil)

	if err != nil {
		log.Fatal(err)
	}
}
