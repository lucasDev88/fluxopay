package routes

import (
	handlers "fintech-api/controllers"
	"fintech-api/middleware"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.Engine) {
	r.POST("/signup", handlers.Signup)
	r.POST("/login", handlers.Login)
	r.POST("/refresh", handlers.Refresh)
	auth := r.Group("/api")
	auth.Use(middleware.Auth())
		auth.GET("/me", handlers.GetUserProfile)
		auth.PUT("/me", handlers.UpdateUserProfile)
		auth.GET("/username", handlers.GetUsername)
		auth.GET("/dashboard", handlers.GetUserDashboard)
		auth.POST("/payments", handlers.AddPayment)
		auth.GET("/payments", handlers.ListPayments)
		auth.DELETE("/payments/:id", handlers.DeletePayment)
		auth.GET("/clients", handlers.ListClients)
		auth.POST("/clients", handlers.AddClient)
		auth.DELETE("/clients/:id", handlers.DeleteClient)
}
