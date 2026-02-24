package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var Secret = []byte("fintech-secret")

func AccessToken(id string, role string) (string, error) {
	claims := jwt.MapClaims{
		"uid": id,
		"role": role,
		"exp": time.Now().Add(time.Minute * 15).Unix(),
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(Secret)
}

func RefreshToken(id string) (string, error) {
	claims := jwt.MapClaims{
		"uid": id,
		"type": "refresh",
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(Secret)
}

func ParseToken(tokenStr string) (jwt.MapClaims, error) {

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return Secret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, err
}
