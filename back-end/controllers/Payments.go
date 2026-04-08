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
		Description string `json:"description"`
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
		Description: input.Description,
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

// Atualizar o pagamento

func UpdatePayment(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	} // Se o ID do usuário não existir ele retorna

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "id de usuário inválido"})
		return
	} // Verifica se o ID do usuário for válido

	idParam := c.Param("id")
	paymentID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON( http.StatusInternalServerError, gin.H{
			"error": "Invalid payment ID",
		} )
		return
	} // Verifica se recebe o parametro ID do pagamento.

	result := database.DB.
		Where("id = ? AND user_id = ?", paymentID, userID).
		First(&models.Payment{}) // Encontra o Modelo

	if result.Error != nil {
		c.JSON( http.StatusInternalServerError, gin.H{
			"error": "Payment not found",
		} )
		return
	} // Checa se o pagamento foi encontrado

	var input struct { // Input da estrutura 
		Name        string `json:"name" binding:"required"`
		Price       int    `json:"price" binding:"required"`
		Description string `json:"description"`
		Situation   string `json:"situation" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil { // Checa se os dados estão válidos
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos"})
		return
	}

	query :=  `UPDATE payments SET situation = $1, name = $2, price = $3, description = $4 WHERE id = $5 AND user_id = $6`

	result = database.DB.Exec(query, input.Situation, input.Name, input.Price, input.Description, paymentID, userID)
	if result.Error != nil {
		c.JSON( http.StatusInternalServerError, gin.H{
			"error": "Failed to update payment",
		} )
		return
	} // Faz a query pro banco de dados

	c.JSON(http.StatusOK, gin.H{"updated": true})
}