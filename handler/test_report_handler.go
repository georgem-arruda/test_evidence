package handler

import (
	"net/http"

	"github.com/georgem-arruda/test_evidence/config"
	"github.com/georgem-arruda/test_evidence/models"

	"github.com/gin-gonic/gin"
)

func CreateTestReport(c *gin.Context) {
	var report models.TestReport
	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.GetDB()
	db.Create(&report)
	c.JSON(http.StatusOK, report)
}
