package handler

import (
	"net/http"

	"github.com/georgem-arruda/test_evidence/config"
	"github.com/georgem-arruda/test_evidence/models"

	"github.com/gin-gonic/gin"
)

func CreateTestCaseEvidence(c *gin.Context) {
	var evidence models.TestCaseEvidence
	if err := c.ShouldBindJSON(&evidence); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.GetDB()
	db.Create(&evidence)
	c.JSON(http.StatusOK, evidence)
}
