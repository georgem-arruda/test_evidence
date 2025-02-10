package handler

import (
	"net/http"

	"github.com/georgem-arruda/test_evidence/config"
	"github.com/georgem-arruda/test_evidence/models"

	"github.com/gin-gonic/gin"
)

func CreateSummary(c *gin.Context) {
	var summary models.Summary
	if err := c.ShouldBindJSON(&summary); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.GetDB()
	db.Create(&summary)
	c.JSON(http.StatusOK, summary)
}
