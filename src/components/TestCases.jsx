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
  
  function TestCases({ testCases, setTestCases, showFieldErrors, errorFields, refs }) {
    const handleAddTestCase = () => {
      setTestCases(prev => {
        const newCases = [
          ...prev,
          {
            id: prev.length + 1,
            description: '',
            expectedResult: '',
            actualResult: '',
            status: 'Selecione o status',
            evidences: []
          }
        ];
        // Reatribui os IDs sequencialmente
        return newCases.map((tc, idx) => ({ ...tc, id: idx + 1 }));
      });
    }
  
    const handleDeleteTestCase = (id) => {
      setTestCases(prev => {
        if (prev.length === 1) return prev; // Não remove se só tem 1
        const filtered = prev.filter(testCase => testCase.id !== id);
        // Reatribui os IDs sequencialmente
        return filtered.map((tc, idx) => ({ ...tc, id: idx + 1 }));
      });
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
          width: '1200px',
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
          {testCases.map((testCase, idx) => {
            // Inicializa refs para cada campo obrigatório do caso de teste
            if (!refs.current[idx]) refs.current[idx] = {};
            return (
              <Card
                key={testCase.id}
                elevation={2}
                sx={{ mb: 3, p: 3, backgroundColor: '#fafafa', borderRadius: 2 }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  CT-{String(testCase.id).padStart(4, '0')}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={testCase.description}
                    onChange={(e) =>
                      handleTestCaseChange(testCase.id, 'description', e.target.value)
                    }
                    sx={{ backgroundColor: '#f8fafc' }}
                    error={showFieldErrors && !testCase.description}
                    helperText={showFieldErrors && !testCase.description ? 'Campo obrigatório' : ''}
                    inputRef={el => refs.current[idx].description = el}
                  />
                  <TextField
                    fullWidth
                    label="Resultado Esperado"
                    multiline
                    minRows={3}
                    value={testCase.expectedResult}
                    onChange={(e) =>
                      handleTestCaseChange(testCase.id, 'expectedResult', e.target.value)
                    }
                    placeholder="Descreva o resultado esperado"
                    sx={{ backgroundColor: '#f8fafc' }}
                    error={showFieldErrors && !testCase.expectedResult}
                    helperText={showFieldErrors && !testCase.expectedResult ? 'Campo obrigatório' : ''}
                    inputRef={el => refs.current[idx].expectedResult = el}
                  />
                  <TextField
                    fullWidth
                    label="Resultado Obtido"
                    multiline
                    minRows={3}
                    value={testCase.actualResult}
                    onChange={(e) =>
                      handleTestCaseChange(testCase.id, 'actualResult', e.target.value)
                    }
                    placeholder="Descreva o resultado obtido"
                    sx={{ backgroundColor: '#f8fafc' }}
                    error={showFieldErrors && !testCase.actualResult}
                    helperText={showFieldErrors && !testCase.actualResult ? 'Campo obrigatório' : ''}
                    inputRef={el => refs.current[idx].actualResult = el}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={testCase.status}
                      label="Status"
                      onChange={(e) =>
                        handleTestCaseChange(testCase.id, 'status', e.target.value)
                      }
                    >
                      <MenuItem value="Selecione o status">Selecione o status</MenuItem>
                      <MenuItem value="Aprovado">Aprovado</MenuItem>
                      <MenuItem value="Reprovado">Reprovado</MenuItem>
                      <MenuItem value="Bloqueado">Bloqueado</MenuItem>
                    </Select>
                  </FormControl>
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Evidências
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed #cfd8dc',
                        borderRadius: 2,
                        p: 3,
                        minHeight: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        mb: 2
                      }}
                      component="label"
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={(e) => handleEvidenceUpload(testCase.id, e)}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 8v16m0 0l-6-6m6 6l6-6" stroke="#90a4ae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="4" y="4" width="32" height="32" rx="16" stroke="#90a4ae" strokeWidth="2"/>
                        </svg>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Arraste e solte imagens ou clique para fazer upload
                        </Typography>
                      </Box>
                    </Box>
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
                  </Box>
                  {testCases.length > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteTestCase(testCase.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Card>
            )
          })}
        </Box>
      </Paper>
    )
  }
  
  export default TestCases
  