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


// =============================
// 👤 GET USER PROFILE
// =============================
func GetUserProfile(c *gin.Context) {
	userIDStr, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}

	UserCollection := database.DB.Collection("users")

	userID, _ := primitive.ObjectIDFromHex(userIDStr.(string))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User

	err := UserCollection.
		FindOne(ctx, bson.M{"_id": userID}).
		Decode(&user)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "usuário não encontrado"})
		return
	}

	user.Password = "" // nunca enviar senha

	c.JSON(http.StatusOK, user)
}


// =============================
// ✏️ UPDATE PROFILE
// =============================
func UpdateUserProfile(c *gin.Context) {
	userIDStr, _ := c.Get("userID")
	userID, _ := primitive.ObjectIDFromHex(userIDStr.(string))
	var body struct {
		Username string `json:"username"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "json inválido"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	UserCollection := database.DB.Collection("users")

	update := bson.M{
		"$set": bson.M{
			"username": body.Username,
		},
	}

	_, err := UserCollection.UpdateByID(ctx, userID, update)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao atualizar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "perfil atualizado"})
}


// =============================
// 🧾 GET USERNAME
// =============================
func GetUsername(c *gin.Context) {
	userIDStr, _ := c.Get("userID")
	userID, _ := primitive.ObjectIDFromHex(userIDStr.(string))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	UserCollection := database.DB.Collection("users")
	err := UserCollection.
		FindOne(ctx, bson.M{"_id": userID}).
		Decode(&user)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"username": user.Name,
	})
}


// =============================
// 📊 DASHBOARD DATA (mock)
// =============================
func GetUserDashboard(c *gin.Context) {
	userIDStr, _ := c.Get("userID")

	c.JSON(http.StatusOK, gin.H{
		"user_id": userIDStr,
		"clientes": 42,
		"receita_mes": 12850,
		"pagamentos": 17,
	})
}
