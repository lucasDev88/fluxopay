package handlers

import (
	"net/http"
	"strconv"

	"fintech-api/database"
	"fintech-api/models"

	"github.com/gin-gonic/gin"
)

func AddPayment(c *gin.Context) {

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

	var input struct {
		Name      string `json:"name" binding:"required"`
		Price     int    `json:"price" binding:"required"`
		Situation string `json:"situation" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos"})
		return
	}

	payment := models.Payment{
		UserID:    userID,
		Name:      input.Name,
		Price:     input.Price,
		Situation: input.Situation,
	}

	if err := database.DB.Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao salvar"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id": payment.ID,
	})
}

func ListPayments(c *gin.Context) {

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

	var payments []models.Payment

	err := database.DB.
		Where("user_id = ?", userID).
		Find(&payments).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro na busca"})
		return
	}

	c.JSON(http.StatusOK, payments)
}

func DeletePayment(c *gin.Context) {

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

	idParam := c.Param("id")
	paymentID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id inválido"})
		return
	}

	result := database.DB.
		Where("id = ? AND user_id = ?", paymentID, userID).
		Delete(&models.Payment{})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao deletar"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}