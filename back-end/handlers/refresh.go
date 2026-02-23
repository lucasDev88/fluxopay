package handlers

import (
	"fintech-api/utils"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gin-gonic/gin"
)

func Refresh(c *gin.Context) {
	var body struct {
		Refresh string `json:"refresh"`
	}

	c.BindJSON(&body)

	token, _ := jwt.Parse(body.Refresh, func(t *jwt.Token) (interface{}, error) {
		return utils.Secret, nil
	})

	claims := token.Claims.(jwt.MapClaims)
	uid := claims["uid"].(string)

	access := utils.AccessToken(uid, "user")

	c.JSON(200, gin.H{"access": access})
}
