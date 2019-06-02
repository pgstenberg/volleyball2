package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"stonecastle.local/pgstenberg/volleyball/internal/app/server"
)

func main() {

	addr := flag.String("addr", "0.0.0.0:8080", "http service address")

	fmt.Printf("Starting server...")

	g := server.NewGame()
	g.Start()

	err := http.ListenAndServe(*addr, nil)

	if err != nil {
		log.Fatal(err)
	}
}
