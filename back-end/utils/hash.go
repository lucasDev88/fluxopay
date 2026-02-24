package utils

import "golang.org/x/crypto/bcrypt"

func Hash(p string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(p), 14)
	
	if err != nil {
    return "", err
}
	return string(hash), nil
}

func Check(hash, p string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(p)) == nil
}
