package handlers

import (
	"fintech-api/database"
	"fintech-api/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func AddClient(c *gin.Context) {
	userIDValue, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}

	userID, ok := userIDValue.(string)

	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "id de usuário inválido",
		})
		return
	}

	var input struct {
		Name	string `json:"name" binding:"required"`
		Situation string `json:"situation" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "dados inválidos",
		})
		return
	}

	client := models.Client{
		UserID:	userID,
		Name: input.Name,
		Situation: input.Situation,
	}

	if err := database.DB.Create(&client).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "erro ao salvar",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id": client.ID,
	})
}

func ListClients(c *gin.Context) {
	userIDValue, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "não autorizado",
		})
		return
	}

	userID, ok := userIDValue.(string)

	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "id de usuário inválido",
		})
		return
	}

	var clients []models.Client

	err := database.DB.
		Where("user_id = ?", userID).
		Find(&clients).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "erro na busca",
		})
		return
	}

	c.JSON(http.StatusOK, clients)
}

func DeleteClient(c *gin.Context) {
	userIDValue, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "não autorizado",
		})
		return
	}

	userID, ok := userIDValue.(string)
	
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "id de usuário inválido",
		})
		return
	}

	idParam := c.Param("id")
	clientID, err := strconv.Atoi(idParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "id inválido",
		})
		return
	}

	result := database.DB.
		Where("id = ? AND user_id = ?", clientID, userID).
		Delete(&models.Client{})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "erro ao deletar",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "não encontrado",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"deleted": true,
	})
}