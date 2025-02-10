package models

type Summary struct {
	ID           uint   `json:"id"`
	TestReportID uint   `json:"test_report_id"`
	TotalCases   int    `json:"total_cases"`
	PassedCases  int    `json:"passed_cases"`
	FailedCases  int    `json:"failed_cases"`
	Coverage     string `json:"coverage"`
}
