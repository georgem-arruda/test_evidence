package handler

import (
	"net/http"

	"github.com/georgem-arruda/test_evidence/config"
	"github.com/georgem-arruda/test_evidence/models"

	"github.com/gin-gonic/gin"
)

func CreateTestCase(c *gin.Context) {
	var testCase models.TestCase
	if err := c.ShouldBindJSON(&testCase); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.GetDB()
	db.Create(&testCase)
	c.JSON(http.StatusOK, testCase)
}

func GetTestCases(c *gin.Context) {
	var testCases []models.TestCase
	db := config.GetDB()
	if err := db.Find(&testCases).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, testCases)
}
