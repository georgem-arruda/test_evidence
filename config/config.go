package config

import (
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// Conecta ao banco de dados
func ConnectDatabase() *gorm.DB {
	dsn := "host=localhost user=seu_usuario dbname=seu_banco password=sua_senha sslmode=disable"
	db, err := gorm.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Erro ao conectar ao banco de dados:", err)
	}
	log.Println("Conectado ao banco de dados!")
	return db
}

var db *gorm.DB

// Retorna a instância do banco de dados
func GetDB() *gorm.DB {
	return db
}
