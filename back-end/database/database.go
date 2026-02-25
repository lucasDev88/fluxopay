package database

import (
	"log"
	"os"
	"time"

	"fintech-api/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL não encontrada no ambiente")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Erro ao conectar ao banco:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Erro ao obter conexão SQL:", err)
	}

	// Pool configuration
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	DB = db

	err = DB.AutoMigrate(
		&models.User{},
		&models.Payment{},
	)
	if err != nil {
		log.Fatal("Erro na migration:", err)
	}

	log.Println("Banco conectado e migrado com sucesso 🚀")
}