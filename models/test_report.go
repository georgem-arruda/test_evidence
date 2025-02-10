package models

type TestReport struct {
	ID                uint       `json:"id"`
	ProjectName       string     `json:"project_name"`
	Version           string     `json:"version"`
	TestDate          string     `json:"test_date"`
	TesterName        string     `json:"tester_name"`
	TestType          string     `json:"test_type"`
	OS                string     `json:"os"`
	BrowserVersion    string     `json:"browser_version"`
	DBVersion         string     `json:"db_version"`
	AdditionalDetails string     `json:"additional_details"`
	TestCases         []TestCase `json:"test_cases"`
	Summary           Summary    `json:"summary"`
}
