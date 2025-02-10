package models

type TestCaseEvidence struct {
	ID             uint   `json:"id"`
	TestCaseID     uint   `json:"test_case_id"`
	Description    string `json:"description"`
	ExpectedResult string `json:"expected_result"`
	ActualResult   string `json:"actual_result"`
	Status         string `json:"status"`
	ScreenshotURL  string `json:"screenshot_url"`
	LogFile        string `json:"log_file"`
}
