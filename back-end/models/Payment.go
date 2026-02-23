package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Payment struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID primitive.ObjectID `bson:"user_id" json:"user_id"`

	Name   string `bson:"name" json:"name"`
	Price  int    `bson:"price" json:"price"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`

	Situation string `bson:"situation" json:"situation"`
}
