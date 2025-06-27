import { useState, useRef } from 'react'
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  TextField,
  Alert,
  Grid
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import GeneralInfo from './components/GeneralInfo'
import TestCases from './components/TestCases'
import { generatePDF } from './components/PDFGenerator'

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 200,
          width: '50%',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ flexGrow: 1, display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
    >
      <Box
        sx={{
          p: 3,
          boxSizing: 'border-box',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {children}
      </Box>
    </div>
  );
}

function SummaryTab({ testCases, summaryNotes, setSummaryNotes }) {
  const total = testCases.length;
  const approved = testCases.filter(tc => tc.status === 'Aprovado').length;
  const rejected = testCases.filter(tc => tc.status === 'Reprovado').length;
  const pending = testCases.filter(tc => tc.status === 'Selecione o status').length;
  const coverage = total > 0 ? ((approved / total) * 100).toFixed(2) : '0.00';
  const blocked = testCases.filter(tc => tc.status === 'Bloqueado').length;

  return (
    <Box sx={{ background: '#fff', borderRadius: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Resumo Geral
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ background: '#f7f9fb', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Total de Casos de Teste:</Typography>
          <Typography variant="subtitle1">{total}</Typography>
        </Box>
        <Box sx={{ background: '#f7f9fb', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Casos Aprovados:</Typography>
          <Typography variant="subtitle1" sx={{ color: '#43a047' }}>{approved}</Typography>
        </Box>
        <Box sx={{ background: '#f7f9fb', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Casos Reprovados:</Typography>
          <Typography variant="subtitle1" sx={{ color: '#e53935' }}>{rejected}</Typography>
        </Box>
        <Box sx={{ background: '#f7f9fb', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Casos Bloqueados:</Typography>
          <Typography variant="subtitle1" sx={{ color: '#e91e63' }}>{blocked}</Typography>
        </Box>
        <Box sx={{ background: '#f7f9fb', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Casos Pendentes:</Typography>
          <Typography variant="subtitle1" sx={{ color: '#fbc02d' }}>{pending}</Typography>
        </Box>
        <Box sx={{ background: '#f7f9fb', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Cobertura dos Testes:</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{coverage}%</Typography>
        </Box>
      </Box>
      <Box sx={{ background: '#fff', borderRadius: 3, p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          Observações Finais e Recomendações
        </Typography>
            <TextField
              fullWidth
              label="Observações e recomendações"
              name="observation"
              multiline
              rows={3}
              value={summaryNotes}
              onChange={e => setSummaryNotes(e.target.value)}
              placeholder="Insira observações e recomendações"
              sx={{ backgroundColor: '#f7f9fb' }}
            />
      </Box>
    </Box>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [generalInfo, setGeneralInfo] = useState({
    product: '',
    version: '',
    date: new Date(),
    responsible: '',
    testType: '',
    testEnvironment: '',
    os: '',
    browser: '',
    database: '',
    objective: ''
  });
  const [testCases, setTestCases] = useState([
    {
      id: 1,
      description: '',
      expectedResult: '',
      actualResult: '',
      status: 'Selecione o status',
      evidences: []
    }
  ]);
  const [summaryNotes, setSummaryNotes] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const productRef = useRef();
  const responsibleRef = useRef();
  const objectiveRef = useRef();
  const testCaseRefs = useRef([]); // array de objetos: { description, expectedResult, actualResult }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Nova função para checar campos obrigatórios e retornar lista dos que estão vazios
  const getEmptyRequiredFields = () => {
    const empty = [];
    if (!generalInfo.product) empty.push('Projeto/Produto');
    if (!generalInfo.objective) empty.push('Objetivo do Teste');
    if (!generalInfo.responsible) empty.push('Responsável pelo Teste');
    if (!testCases.length) empty.push('Pelo menos 1 Caso de Teste');
    testCases.forEach((testCase, idx) => {
      if (!testCase.description) empty.push(`Descrição do Caso ${idx + 1}`);
      if (!testCase.expectedResult) empty.push(`Resultado Esperado do Caso ${idx + 1}`);
      if (!testCase.actualResult) empty.push(`Resultado Obtido do Caso ${idx + 1}`);
    });
    return empty;
  };

  const handleGeneratePDF = async () => {
    const emptyFields = getEmptyRequiredFields();
    if (emptyFields.length > 0) {
      setErrorFields(emptyFields);
      setShowFieldErrors(true);
      // Foco no primeiro campo obrigatório vazio
      if (!generalInfo.product && productRef.current) {
        setTabValue(0);
        productRef.current.focus();
        return;
      }
      if (!generalInfo.responsible && responsibleRef.current) {
        setTabValue(0);
        responsibleRef.current.focus();
        return;
      }
      if (!generalInfo.objective && objectiveRef.current) {
        setTabValue(0);
        objectiveRef.current.focus();
        return;
      }
      for (let i = 0; i < testCases.length; i++) {
        if (!testCases[i].description && testCaseRefs.current[i]?.description) {
          setTabValue(1);
          testCaseRefs.current[i].description.focus();
          return;
        }
        if (!testCases[i].expectedResult && testCaseRefs.current[i]?.expectedResult) {
          setTabValue(1);
          testCaseRefs.current[i].expectedResult.focus();
          return;
        }
        if (!testCases[i].actualResult && testCaseRefs.current[i]?.actualResult) {
          setTabValue(1);
          testCaseRefs.current[i].actualResult.focus();
          return;
        }
      }
      return;
    }
    setErrorFields([]);
    setShowFieldErrors(false);
    await generatePDF(generalInfo, testCases, {
      total: testCases.length,
      approved: testCases.filter(tc => tc.status === 'Aprovado').length,
      rejected: testCases.filter(tc => tc.status === 'Reprovado').length,
      blocked: testCases.filter(tc => tc.status === 'Bloqueado').length,
      pending: testCases.filter(tc => tc.status === 'Selecione o status').length,
      coverage: testCases.length > 0 ? ((testCases.filter(tc => tc.status === 'Aprovado').length / testCases.length) * 100).toFixed(1) : '0.0',
      summaryNotes
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', minWidth: '100vw', width: '100vw', height: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'none', p: 0, m: 0 }}>
        <Paper elevation={0} sx={{
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          minWidth: '100vw',
          borderRadius: 0,
          boxShadow: 'none',
          background: '#fff',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1, sm: 3, md: 5 },
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, mt: 2, position: 'relative', width: '100%' }}>
            <Typography variant="h3" component="h1" sx={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>
              Relatório de Evidências de Testes de Software
            </Typography>
            <Button
              variant="contained"
              sx={{
                position: 'absolute',
                right: { xs: 8, sm: 24, md: 40 },
                top: 0,
                borderRadius: '24px',
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 4,
                py: 1.5,
                background: '#e6007a',
                color: '#fff',
                boxShadow: 'none',
                '&:hover': {
                  background: '#ad1457',
                },
              }}
              onClick={handleGeneratePDF}
            >
              Gerar Relatório
            </Button>
          </Box>
          
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <Paper elevation={0} sx={{
              backgroundColor: '#fff',
              borderRadius: 3,
              boxShadow: '0 1px 8px 0 #e0e0e0',
              width: '100%',
              maxWidth: 1350,
              minWidth: 320,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              border: '1.5px solid #bdbdbd',
              p: 3,
              flex: 1,
              minHeight: 0,
            }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="test evidence tabs"
                  variant="fullWidth"
                  sx={{ minHeight: 64, borderRadius: 2, overflow: 'hidden' }}
                >
                  <Tab label="Informações e Escopo" sx={{ minHeight: 64, fontSize: 18, borderRadius: '12px 12px 0 0' }} />
                  <Tab label="Casos de Testes" sx={{ minHeight: 64, fontSize: 18, borderRadius: '12px 12px 0 0' }} />
                  <Tab label="Resumo" sx={{ minHeight: 64, fontSize: 18, borderRadius: '12px 12px 0 0' }} />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <GeneralInfo
                  generalInfo={generalInfo}
                  setGeneralInfo={setGeneralInfo}
                  showFieldErrors={showFieldErrors}
                  errorFields={errorFields}
                  refs={{
                    product: productRef,
                    responsible: responsibleRef,
                    objective: objectiveRef
                  }}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                  <TestCases
                    testCases={testCases}
                    setTestCases={setTestCases}
                    showFieldErrors={showFieldErrors}
                    errorFields={errorFields}
                    refs={testCaseRefs}
                  />
                </Box>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <SummaryTab testCases={testCases} summaryNotes={summaryNotes} setSummaryNotes={setSummaryNotes} />

              </TabPanel>
            </Paper>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}

export default App
