package handlers

import (
	"context"
	"time"

	"fintech-api/database"
	"fintech-api/models"
	"fintech-api/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/gin-gonic/gin"
)

func Signup(c *gin.Context) {
	var u models.User
	if c.BindJSON(&u) != nil {
		c.JSON(400, gin.H{"error": "invalid"})
		return
	}

	if database.DB == nil {
		c.JSON(500, gin.H{
			"error": "db not connected",
		})
	}

	u.Password = utils.Hash(u.Password)
	u.Role = "user"

	col := database.DB.Collection("users")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, _ := col.InsertOne(ctx, u)

	id := res.InsertedID.(primitive.ObjectID).Hex()

	access := utils.AccessToken(id, u.Role)
	refresh := utils.RefreshToken(id)

	col.UpdateByID(ctx, res.InsertedID, gin.H{"$set": gin.H{"refresh_token": refresh}})

	c.JSON(201, gin.H{
		"access": access,
		"refresh": refresh,
	})
}
