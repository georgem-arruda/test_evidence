package main

import (
	"log"

	"github.com/georgem-arruda/test_evidence/config"
	"github.com/georgem-arruda/test_evidence/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Conecta ao banco de dados
	config.ConnectDatabase()

	// Inicializa o Gin
	r := gin.Default()

	// Configuração das rotas
	routes.SetupRoutes(r)

	// Inicia o servidor na porta 8080
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Erro ao iniciar o servidor:", err)
	}
}
