package handlers

import (
	"github.com/gin-gonic/gin"

	"fintech-api/models"
	service "fintech-api/services"
	"fintech-api/utils"
)

func Signup(c *gin.Context) {
	var cadaster models.SignupDTO

	if err := c.BindJSON(&cadaster); err != nil {
		c.JSON(400, gin.H{"error": "Dados inválidos."})
		return
	}

	exists, msg, err := service.EmailExists(cadaster.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "erro ao verificar email"})
		return
	}

	if exists {
		c.JSON(400, gin.H{"error": msg})
		return
	}

	userCreated, err := service.CreateUser(cadaster)
	if err != nil {
		c.JSON(500, gin.H{"error": "Erro na criação do usuário."})
		return
	}

	// do not send password back
	userCreated.Password = ""
	
	c.JSON(201, gin.H{"user": userCreated, "message": "Usuário criado com sucesso!"})
}
func Login(c *gin.Context) {
	var login models.LoginDTO

	if err := c.BindJSON(&login); err != nil {
		c.JSON(400, gin.H{"error": "Dados inválidos"})
		return
	}

	userDb, msg := service.GetUserByEmail(login.Email)
	if userDb == nil {
		c.JSON(400, gin.H{"error": msg})
		return
	}

	if !utils.Check(userDb.Password, login.Password) {
		c.JSON(400, gin.H{"error": "Senha incorreta"})
		return
	}

	// Cria tokens
	accessToken, err := utils.AccessToken(userDb.ID, userDb.Role)
	if err != nil {
		c.JSON(500, gin.H{"error": "falha ao gerar token"})
		return
	}
	refreshToken, err := utils.RefreshToken(userDb.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "falha ao gerar token de refresh"})
		return
	}

	c.JSON(200, gin.H{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"message":       "Login realizado com sucesso!",
	})
}