package utils

import "golang.org/x/crypto/bcrypt"

func Hash(p string) string {
	h, _ := bcrypt.GenerateFromPassword([]byte(p), 14)
	return string(h)
}

func Check(hash, p string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(p)) == nil
}
