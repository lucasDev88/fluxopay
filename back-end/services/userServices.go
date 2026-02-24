package service

import (
	"errors"
	"fintech-api/database"
	"fintech-api/models"
	"fintech-api/utils"
	"fmt"

	"gorm.io/gorm"
)

func EmailExists(email string) (exists bool, msg string, err error) {
	var user models.User

	err = database.DB.
		Where("email = ?", email).
		First(&user).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return false, "Email não encontrado.", nil
	}

	if err != nil {
		fmt.Println(err)
		return false, "Erro na busca.", err
	}

	return true, "Este Email já está em uso.", nil
}

func CreateUser(cadaster models.SignupDTO) (models.User, error) {
	passwordHashed, errHash := utils.Hash(cadaster.Password);

	if errHash != nil {
		return models.User{}, errHash
	}

	user := models.User{
		Name:     cadaster.Name,
		Email:    cadaster.Email,
		Password: passwordHashed,
		Role:     "user",
	}

	err := database.DB.Create(&user).Error

	if err != nil {
		return models.User{}, err
	}

	return user, nil
}
func GetUserByEmail(email string) (*models.User, string) {
    var user models.User
    err := database.DB.Where("email = ?", email).First(&user).Error

    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, "Usuário não encontrado"
        }

        return nil, "Erro ao buscar usuário"
    }

    return &user, ""
}
