package middleware

import (
	"fintech-api/utils"
	"strings"

	"github.com/gin-gonic/gin"
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

		uid, ok := claims["uid"].(string)
		if !ok {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token claims"})
			return
		}

		c.Set("userID", uid)
		c.Set("claims", claims)
		c.Next()
	}
}
