import {
    TextField,
    Box,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    IconButton,
    Card,
    Paper
  } from '@mui/material'
  import DeleteIcon from '@mui/icons-material/Delete'
  import AddIcon from '@mui/icons-material/Add'
  
  function TestCases({ testCases, setTestCases }) {
    const handleAddTestCase = () => {
      setTestCases(prev => [
        ...prev,
        {
          id: prev.length + 1,
          description: '',
          expectedResult: '',
          actualResult: '',
          status: 'Selecione o status',
          evidences: []
        }
      ])
    }
  
    const handleDeleteTestCase = (id) => {
      setTestCases(prev => prev.filter(testCase => testCase.id !== id))
    }
  
    const handleTestCaseChange = (id, field, value) => {
      setTestCases(prev =>
        prev.map(testCase =>
          testCase.id === id ? { ...testCase, [field]: value } : testCase
        )
      )
    }
  
    const handleEvidenceUpload = (id, event) => {
      const files = Array.from(event.target.files)
      setTestCases(prev =>
        prev.map(testCase =>
          testCase.id === id
            ? { ...testCase, evidences: [...(testCase.evidences || []), ...files] }
            : testCase
        )
      )
    }
  
    const handleRemoveEvidence = (id, index) => {
      setTestCases(prev =>
        prev.map(testCase =>
          testCase.id === id
            ? { ...testCase, evidences: testCase.evidences.filter((_, i) => i !== index) }
            : testCase
        )
      )
    }
  
    return (
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          backgroundColor: '#ffffff',
          minHeight: '500px',
          height: '700px',
          width: '1300px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTestCase}
          >
            Adicionar Caso de Teste
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            pr: 1,
          }}
        >
          {testCases.map((testCase) => (
            <Card
              key={testCase.id}
              elevation={2}
              sx={{ mb: 3, p: 3, backgroundColor: '#fafafa', borderRadius: 2 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Caso de Teste {testCase.id}
              </Typography>
  
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição do Teste"
                    multiline
                    rows={3}
                    value={testCase.description}
                    onChange={(e) =>
                      handleTestCaseChange(testCase.id, 'description', e.target.value)
                    }
                    required
                    sx={{ backgroundColor: '#ffffff', minWidth: 1200 }}
                  />
                </Grid>
  
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Resultado Esperado"
                    multiline
                    rows={3}
                    value={testCase.expectedResult}
                    onChange={(e) =>
                      handleTestCaseChange(testCase.id, 'expectedResult', e.target.value)
                    }
                    required
                    sx={{ backgroundColor: '#ffffff', minWidth: 1200 }}
                  />
                </Grid>
  
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Resultado Obtido"
                    multiline
                    rows={3}
                    value={testCase.actualResult}
                    onChange={(e) =>
                      handleTestCaseChange(testCase.id, 'actualResult', e.target.value)
                    }
                    required
                    sx={{ backgroundColor: '#ffffff', minWidth: 1200 }}
                  />
                </Grid>
  
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Selecione o status</InputLabel>
                    <Select
                      value={testCase.status}
                      label="Selecione o status"
                      onChange={(e) =>
                        handleTestCaseChange(testCase.id, 'status', e.target.value)
                      }
                    >
                      <MenuItem value="Selecione o status">Selecione o status</MenuItem>
                      <MenuItem value="Aprovado">Aprovado</MenuItem>
                      <MenuItem value="Reprovado">Reprovado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
  
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: '56px' }}
                  >
                    Adicionar Evidência
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={(e) => handleEvidenceUpload(testCase.id, e)}
                    />
                  </Button>
  
                  {testCase.evidences && testCase.evidences.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {testCase.evidences.map((file, idx) => (
                        <Box key={idx} sx={{ position: 'relative', mr: 2 }}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Evidência ${idx + 1} do caso de teste ${testCase.id}`}
                            style={{ maxWidth: '120px', maxHeight: '120px', borderRadius: 4, border: '1px solid #ccc' }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveEvidence(testCase.id, idx)}
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
  
                {testCases.length > 1 && (
                  <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteTestCase(testCase.id)}
                      sx={{ mt: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Card>
          ))}
        </Box>
      </Paper>
    )
  }
  
  export default TestCases
  