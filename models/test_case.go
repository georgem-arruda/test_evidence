package models

type TestCase struct {
	ID           uint               `json:"id"`
	TestReportID uint               `json:"test_report_id"`
	CaseID       string             `json:"case_id"`
	Description  string             `json:"description"`
	Priority     string             `json:"priority"`
	Status       string             `json:"status"`
	Remarks      string             `json:"remarks"`
	Evidences    []TestCaseEvidence `json:"evidences"`
}
