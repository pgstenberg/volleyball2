package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server"
)

func main() {

	addr := flag.String("addr", "127.0.0.1:8080", "http service address")

	fmt.Printf("Starting server...")

	g := server.NewGame()
	g.Start()

	err := http.ListenAndServe(*addr, nil)

	if err != nil {
		log.Fatal(err)
	}
}
