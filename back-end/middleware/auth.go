package middleware

import (
	"strings"
	"github.com/gin-gonic/gin"
	"fintech-api/utils"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {

		h := c.GetHeader("Authorization")

		if h == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "missing header"})
			return
		}

		parts := strings.Split(h, " ")

		if len(parts) != 2 {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid header"})
			return
		}

		tokenStr := parts[1]

		claims, err := utils.ParseToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		uid := claims["uid"].(string)

		c.Set("userID", uid)
		c.Next()
	}
}
