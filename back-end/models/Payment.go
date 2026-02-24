package models

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	ID uint `gorm:"primaryKey" json:"id"`

	// user id stored as uuid string to match User.ID
	UserID string `gorm:"type:uuid;not null;index" json:"user_id"`

	Name  string `gorm:"type:varchar(100);not null" json:"name"`
	Price int    `gorm:"not null" json:"price"`

	Situation string `gorm:"type:varchar(50);not null" json:"situation"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}