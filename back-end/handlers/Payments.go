package handlers

import (
	"context"
	"fintech-api/database"
	"fintech-api/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddPayment(c *gin.Context) {
	userIDStr, _ := c.Get("userID")
	userID, _ := primitive.ObjectIDFromHex(userIDStr.(string))

	var input struct {
		Name  string `json:"name"`
		Price int    `json:"price"`
		Situation string `json:"situation"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos"})
		return
	}

	payment := models.Payment{
		UserID:    userID,
		Name:      input.Name,
		Price:     input.Price,
		CreatedAt: time.Now(),
		Situation: input.Situation,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	col := database.DB.Collection("payments")

	res, err := col.InsertOne(ctx, payment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao salvar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id": res.InsertedID,
	})
}

func ListPayments(c *gin.Context) {
	userIDStr, _ := c.Get("userID")
	userID, _ := primitive.ObjectIDFromHex(userIDStr.(string))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	col := database.DB.Collection("payments")

	cursor, err := col.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro na busca"})
		return
	}

	var payments []models.Payment
	cursor.All(ctx, &payments)

	c.JSON(http.StatusOK, payments)
}

func DeletePayment(c *gin.Context) {
	userIDStr, _ := c.Get("userID")
	userID, _ := primitive.ObjectIDFromHex(userIDStr.(string))

	idParam := c.Param("id")
	paymentID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id inválido"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	col := database.DB.Collection("payments")

	res, err := col.DeleteOne(ctx, bson.M{
		"_id": paymentID,
		"user_id": userID, // segurança: só deleta o próprio
	})

	if err != nil || res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}
