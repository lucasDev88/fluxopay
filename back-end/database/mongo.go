package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func Connect() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb+srv://fluxopayofc_db_user:0wvup3eo5RgrGK8n@fluxopay.x3axzca.mongodb.net/?appName=FluxoPay"))
	
	if err != nil {
		panic("mongo connect error: " + err.Error())
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		panic("mongo ping error: " + err.Error())
	}

	DB = client.Database("fintech")

	println("✅ Mongo conectado")

	DB = client.Database("fintech")
}
