package main

import (
	"flag"
	"log"
	"net/http"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server"
)

func main() {

	addr := flag.String("addr", "0.0.0.0:8080", "http service address")

	g := server.NewGame()
	g.Start()

	err := http.ListenAndServe(*addr, nil)

	if err != nil {
		log.Fatal(err)
	}
}
