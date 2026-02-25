package models

import "time"

//ESTRUTURA PRINCIPAL DO BANCO

type User struct {
	ID 			 string    `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Name         string    `json:"name" gorm:"not null" binding:"min=2, max=100"`
	Email        string    `json:"email" gorm:"unique;not null"`
	Password     string    `json:"-" gorm:"not null" binding:"min=7, max=30"`
	Assinature   string    `json:"assinature" gorm:"not null"`
	Role         string    `json:"role" gorm:"not null"`
	RefreshToken *string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}


//DTOS

type SignupDTO struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}