package routes

import (
	"github.com/georgem-arruda/test_evidence/handler"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Rotas para relatórios de teste
	r.POST("/testreport", handler.CreateTestReport)

	// Rotas para casos de teste
	r.POST("/testcase", handler.CreateTestCase)
	r.GET("/testcases", handler.GetTestCases)

	// Rotas para evidências de casos de teste
	r.POST("/testcase/evidence", handler.CreateTestCaseEvidence)

	// Rotas para resumo
	r.POST("/summary", handler.CreateSummary)
}
