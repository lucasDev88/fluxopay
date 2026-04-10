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
// 📊 DASHBOARD DATA
// =============================
func GetUserDashboard(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "id de usuário inválido"})
		return
	}

	// Get total clients
	var totalClients int64
	if err := database.DB.Model(&models.Client{}).Where("user_id = ?", userID).Count(&totalClients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar clientes"})
		return
	}

	// Get total payments
	var totalPayments int64
	if err := database.DB.Model(&models.Payment{}).Where("user_id = ?", userID).Count(&totalPayments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar pagamentos"})
		return
	}

	// Get total revenue (sum of approved payments)
	var totalRevenue int64
	if err := database.DB.Model(&models.Payment{}).Where("user_id = ? AND situation = ?", userID, "Aprovado").Select("COALESCE(SUM(price), 0)").Scan(&totalRevenue).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao calcular receita"})
		return
	}

	// Get pending payments count
	var pendingPayments int64
	if err := database.DB.Model(&models.Payment{}).Where("user_id = ? AND situation = ?", userID, "Pendente").Count(&pendingPayments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar pagamentos pendentes"})
		return
	}

	// Get failed payments count
	var failedPayments int64
	if err := database.DB.Model(&models.Payment{}).Where("user_id = ? AND situation = ?", userID, "Recusado").Count(&failedPayments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar pagamentos recusados"})
		return
	}

	// Get recent payments (last 5)
	var recentPayments []models.Payment
	if err := database.DB.Where("user_id = ?", userID).Order("created_at DESC").Limit(5).Find(&recentPayments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar pagamentos recentes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total_clients":   totalClients,
		"total_payments":  totalPayments,
		"total_revenue":   totalRevenue,
		"pending":         pendingPayments,
		"failed":          failedPayments,
		"recent_payments": recentPayments,
	})
}
