package handlers

import (
	"net/http"
	"strconv"

	"fintech-api/database"
	"fintech-api/models"

	"github.com/gin-gonic/gin"
)

// validateCustomerExists checks if a customer exists for the given user
func validateCustomerExists(customerID uint, userID string) bool {
	var client models.Client
	result := database.DB.Where("id = ? AND user_id = ?", customerID, userID).First(&client)
	return result.Error == nil
}

// AddPayment creates a new payment, optionally linked to a customer
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
		Name        string `json:"name" binding:"required"`
		Price       int    `json:"price" binding:"required"`
		Description string `json:"description"`
		Situation   string `json:"situation" binding:"required"`
		CustomerID  *uint  `json:"customer_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos"})
		return
	}

	// Validate customer exists if customerID is provided
	if input.CustomerID != nil {
		if !validateCustomerExists(*input.CustomerID, userID) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "cliente não encontrado"})
			return
		}
	}

	payment := models.Payment{
		UserID:      userID,
		CustomerID:  input.CustomerID,
		Name:        input.Name,
		Price:       input.Price,
		Description: input.Description,
		Situation:   input.Situation,
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid payment ID",
		})
		return
	} // Verifica se recebe o parametro ID do pagamento.

	result := database.DB.
		Where("id = ? AND user_id = ?", paymentID, userID).
		First(&models.Payment{}) // Encontra o Modelo

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Payment not found",
		})
		return
	} // Checa se o pagamento foi encontrado

	var input struct { // Input da estrutura
		Name        string `json:"name"`
		Price       int    `json:"price"`
		Description string `json:"description"`
		Situation   string `json:"situation"`
		CustomerID  *uint  `json:"customer_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil { // Checa se os dados estão válidos
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos"})
		return
	}

	// Validate customer exists if customerID is provided
	if input.CustomerID != nil {
		if !validateCustomerExists(*input.CustomerID, userID) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "cliente não encontrado"})
			return
		}
	}

	// Build dynamic update query
	query := "UPDATE payments SET "
	args := []interface{}{}
	updates := []string{}

	if input.Name != "" {
		updates = append(updates, "name = $1")
		args = append(args, input.Name)
	} else {
		updates = append(updates, "name = name")
	}

	if input.Price != 0 {
		if len(updates) == 1 {
			updates = append(updates, "price = $2")
		} else {
			updates = append(updates, "price = $"+strconv.Itoa(len(args)+1))
		}
		args = append(args, input.Price)
	} else {
		updates = append(updates, "price = price")
	}

	if input.Description != "" {
		if len(updates) == 1 {
			updates = append(updates, "description = $3")
		} else {
			updates = append(updates, "description = $"+strconv.Itoa(len(args)+1))
		}
		args = append(args, input.Description)
	} else {
		updates = append(updates, "description = description")
	}

	if input.Situation != "" {
		if len(updates) == 1 {
			updates = append(updates, "situation = $4")
		} else {
			updates = append(updates, "situation = $"+strconv.Itoa(len(args)+1))
		}
		args = append(args, input.Situation)
	} else {
		updates = append(updates, "situation = situation")
	}

	if input.CustomerID != nil {
		if len(updates) == 1 {
			updates = append(updates, "customer_id = $5")
		} else {
			updates = append(updates, "customer_id = $"+strconv.Itoa(len(args)+1))
		}
		args = append(args, *input.CustomerID)
	} else {
		updates = append(updates, "customer_id = customer_id")
	}

	query += "name=name, price=price, description=description, situation=situation, customer_id=customer_id WHERE id = $" + strconv.Itoa(len(args)+1) + " AND user_id = $" + strconv.Itoa(len(args)+2)
	args = append(args, paymentID, userID)

	result = database.DB.Exec(query, args...)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update payment",
		})
		return
	} // Faz a query pro banco de dados

	c.JSON(http.StatusOK, gin.H{"updated": true})
}
