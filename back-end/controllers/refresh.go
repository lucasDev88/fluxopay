package handlers

import (
	"fintech-api/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Refresh(c *gin.Context) {
	var body struct {
		Refresh string `json:"refresh" binding:"required"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "token não enviado"})
		return
	}

	token, err := jwt.Parse(body.Refresh, func(t *jwt.Token) (interface{}, error) {
		return utils.Secret, nil
	})
	if err != nil || token == nil {
		c.JSON(401, gin.H{"error": "token inválido"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		c.JSON(401, gin.H{"error": "token inválido"})
		return
	}

	// ensure it's a refresh token
	if claims["type"] != "refresh" {
		c.JSON(400, gin.H{"error": "não é refresh token"})
		return
	}

	uid, ok := claims["uid"].(string)
	if !ok {
		c.JSON(400, gin.H{"error": "id de usuário inválido"})
		return
	}

	access, err := utils.AccessToken(uid, "user")
	if err != nil {
		c.JSON(500, gin.H{"error": "erro ao criar access token"})
		return
	}

	c.JSON(200, gin.H{"access": access})
}
