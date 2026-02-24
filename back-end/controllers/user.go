package handlers

import (
	"net/http"

	"fintech-api/database"
	"fintech-api/models"

	"github.com/gin-gonic/gin"
)

// =============================
// 👤 GET USER PROFILE
// =============================
func GetUserProfile(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ID inválido"})
		return
	}

	var user models.User
	err := database.DB.First(&user, "id = ?", userID).Error
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
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ID inválido"})
		return
	}

	var body struct {
		Username string `json:"username" binding:"required,min=2,max=50"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "json inválido"})
		return
	}

	// Atualiza o usuário
	err := database.DB.Model(&models.User{}).
		Where("id = ?", userID).
		Update("name", body.Username).Error

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
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ID inválido"})
		return
	}

	var user models.User
	err := database.DB.Select("id", "name").First(&user, "id = ?", userID).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "usuário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"username": user.Name})
}

// =============================
// 📊 DASHBOARD DATA (mock)
// =============================
func GetUserDashboard(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}

	userID, _ := userIDValue.(string)
	c.JSON(http.StatusOK, gin.H{
		"user_id":     userID,
		"clientes":    42,
		"receita_mes": 12850,
		"pagamentos":  17,
	})
}