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
  import { useState, useRef } from 'react'
  
  function TestCases({ testCases, setTestCases, showFieldErrors, errorFields, refs }) {
    const [dragStates, setDragStates] = useState({})
    const descriptionRefs = useRef([])

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
      setTimeout(() => {
        if (descriptionRefs.current[testCases.length]) {
          descriptionRefs.current[testCases.length].focus();
        }
      }, 0);
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
      const files = Array.from(event.target.files || event.dataTransfer?.files || [])
      if (files.length > 0) {
        setTestCases(prev =>
          prev.map(testCase =>
            testCase.id === id
              ? { ...testCase, evidences: [...(testCase.evidences || []), ...files] }
              : testCase
          )
        )
      }
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

    const handleDragOver = (e, testCaseId) => {
      e.preventDefault()
      e.stopPropagation()
      setDragStates(prev => ({ ...prev, [testCaseId]: true }))
    }

    const handleDragEnter = (e, testCaseId) => {
      e.preventDefault()
      e.stopPropagation()
      setDragStates(prev => ({ ...prev, [testCaseId]: true }))
    }

    const handleDragLeave = (e, testCaseId) => {
      e.preventDefault()
      e.stopPropagation()
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setDragStates(prev => ({ ...prev, [testCaseId]: false }))
      }
    }

    const handleDrop = (e, testCaseId) => {
      e.preventDefault()
      e.stopPropagation()
      setDragStates(prev => ({ ...prev, [testCaseId]: false }))
      
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        // Filtrar apenas imagens
        const imageFiles = files.filter(file => file.type.startsWith('image/'))
        if (imageFiles.length > 0) {
          setTestCases(prev =>
            prev.map(testCase =>
              testCase.id === testCaseId
                ? { ...testCase, evidences: [...(testCase.evidences || []), ...imageFiles] }
                : testCase
            )
          )
        }
      }
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
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            sx={{
              border: '2px solid #1976d2',
              borderRadius: '24px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              padding: '12px 0',
              maxWidth: '280px',
              minWidth: '220px',
              width: '100%',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s, color 0.2s',
              background: '#1976d2',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': {
                background: '#1565c0',
              },
            }}
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
            const isDragOver = dragStates[testCase.id] || false;
            
            return (
              <Card
                key={testCase.id}
                elevation={2}
                sx={{ mb: 3, p: 3, backgroundColor: '#fafafa', borderRadius: 2, boxShadow: '0 1px 4px #eee' }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  CT-{String(testCase.id).padStart(4, '0')}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    aria-label="Descrição"
                    value={testCase.description}
                    onChange={(e) => handleTestCaseChange(testCase.id, 'description', e.target.value)}
                    placeholder="Descreva o caso de teste..."
                    sx={{
                      backgroundColor: showFieldErrors && !testCase.description ? '#c0c0c0' : '#ffffff',
                      borderRadius: 2,
                      boxShadow: '0 1px 4px #eee',
                      mb: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#757575',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#757575',
                      },
                    }}
                    error={false}
                    helperText={showFieldErrors && !testCase.description ? (
                      <span style={{ color: '#616161' }}>Campo obrigatório: descreva o caso de teste.</span>
                    ) : ''}
                    inputRef={el => { refs.current[idx].description = el; descriptionRefs.current[idx] = el; }}
                    required
                  />
                  <Grid container spacing={2} sx={{ width: '100%', mb: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
                      <TextField
                        fullWidth
                        label="Resultado Esperado"
                        aria-label="Resultado Esperado"
                        multiline
                        minRows={5}
                        value={testCase.expectedResult}
                        onChange={(e) => handleTestCaseChange(testCase.id, 'expectedResult', e.target.value)}
                        placeholder="O que deveria acontecer..."
                        sx={{
                          backgroundColor: showFieldErrors && !testCase.expectedResult ? '#c0c0c0' : '#ffffff',
                          borderRadius: 2,
                          boxShadow: '0 1px 4px #eee',
                          width: 563,
                          mb: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#757575',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#757575',
                          },
                        }}
                        error={false}
                        helperText={showFieldErrors && !testCase.expectedResult ? (
                          <span style={{ color: '#616161' }}>Campo obrigatório: descreva o que deveria acontecer.</span>
                        ) : ''}
                        inputRef={el => refs.current[idx].expectedResult = el}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
                      <TextField
                        fullWidth
                        label="Resultado Obtido"
                        aria-label="Resultado Obtido"
                        multiline
                        minRows={5}
                        value={testCase.actualResult}
                        onChange={(e) => handleTestCaseChange(testCase.id, 'actualResult', e.target.value)}
                        placeholder="O que ocorreu durante o teste..."
                        sx={{
                          backgroundColor: showFieldErrors && !testCase.actualResult ? '#c0c0c0' : '#ffffff',
                          borderRadius: 2,
                          width: 563,
                          boxShadow: '0 1px 4px #eee',
                          mb: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#757575',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#757575',
                          },
                        }}
                        error={false}
                        helperText={showFieldErrors && !testCase.actualResult ? (
                          <span style={{ color: '#616161' }}>Campo obrigatório: descreva o que ocorreu durante o teste.</span>
                        ) : ''}
                        inputRef={el => refs.current[idx].actualResult = el}
                        required
                      />
                    </Grid>
                  </Grid>
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
                        border: `2px dashed ${isDragOver ? '#1976d2' : '#cfd8dc'}`,
                        borderRadius: 2,
                        p: 3,
                        minHeight: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDragOver ? '#e3f2fd' : '#fff',
                        cursor: 'pointer',
                        mb: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#1976d2',
                          backgroundColor: '#f5f5f5',
                        }
                      }}
                      component="label"
                      onDragOver={(e) => handleDragOver(e, testCase.id)}
                      onDragEnter={(e) => handleDragEnter(e, testCase.id)}
                      onDragLeave={(e) => handleDragLeave(e, testCase.id)}
                      onDrop={(e) => handleDrop(e, testCase.id)}
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
                          <path d="M20 8v16m0 0l-6-6m6 6l6-6" stroke={isDragOver ? "#1976d2" : "#90a4ae"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="4" y="4" width="32" height="32" rx="16" stroke={isDragOver ? "#1976d2" : "#90a4ae"} strokeWidth="2"/>
                        </svg>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                          {isDragOver ? 'Solte as imagens aqui!' : 'Arraste e solte imagens ou clique para fazer upload'}
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
  