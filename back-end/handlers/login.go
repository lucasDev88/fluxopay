package handlers

import (
	"context"
	"time"

	"fintech-api/database"
	"fintech-api/models"
	"fintech-api/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func Login(c *gin.Context) {
	var input models.User
	c.BindJSON(&input)

	col := database.DB.Collection("users")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var u models.User
	err := col.FindOne(ctx, bson.M{"email": input.Email}).Decode(&u)

	if err != nil || !utils.Check(u.Password, input.Password) {
		c.JSON(401, gin.H{"error": "invalid"})
		return
	}

	id := u.ID.Hex()

	access := utils.AccessToken(id, u.Role)
	refresh := utils.RefreshToken(id)

	col.UpdateByID(ctx, u.ID, bson.M{"$set": bson.M{"refresh_token": refresh}})

	c.JSON(200, gin.H{
		"access": access,
		"refresh": refresh,
	})
}
