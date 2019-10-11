package main

import (
	"flag"
	"net/http"
	"os"

	log "github.com/sirupsen/logrus"

	"stonecastle.internal.stonepath.se/pgstenberg/volleyball/internal/app/server"
)

func main() {

	log.SetFormatter(&log.JSONFormatter{})
	log.SetOutput(os.Stdout)
	log.SetLevel(log.DebugLevel)

	addr := flag.String("addr", "127.0.0.1:8080", "http service address")

	log.Info("Starting server...")

	g := server.NewGame()
	g.Start()

	err := http.ListenAndServe(*addr, nil)

	if err != nil {
		log.Fatal(err)
	}
}
