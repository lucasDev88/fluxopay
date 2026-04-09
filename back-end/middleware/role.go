package middleware

import (
	"github.com/gin-gonic/gin"
)

func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {

		userRole, exists := c.Get("role")

		if !exists || userRole.(string) != role {
			c.JSON(403, gin.H{"error": "acesso negado"})
			c.Abort()
			return
		}

		c.Next()
	}
}