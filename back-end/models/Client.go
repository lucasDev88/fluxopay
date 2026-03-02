package models

import (
	"time"
)

type Client struct {
	ID uint `gorm:"primaryKey" json:"id"`

	UserID string `gorm:"type:uuid;not null;index" json:"user_id"`

	Name string `gorm:"type:varchar(100);not null" json:"name"`

	Situation string `gorm:"type:varchar(30);not null" json:"situation"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}