import { useState } from 'react'
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
  TextField
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import GeneralInfo from './components/GeneralInfo'
import TestCases from './components/TestCases'
import { generatePDF } from './components/PDFGenerator'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
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

  return (
    <Box sx={{ background: '#fff', borderRadius: 3, mb: 4 }}>
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
          <Typography variant="subtitle1">Casos Pendentes:</Typography>
          <Typography variant="subtitle1" sx={{ color: '#fbc02d' }}>{pending}</Typography>
        </Box>
        <Box sx={{ background: '#f7f9fb', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Cobertura dos Testes:</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{coverage}%</Typography>
        </Box>
      </Box>
      <Box sx={{ background: '#fff', borderRadius: 3, p: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    Observações Finais e Recomendações
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={6}
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Função para checar se todos os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    if (!generalInfo.product || !generalInfo.objective || !generalInfo.responsible) return false;
    if (!testCases.length) return false;
    for (const testCase of testCases) {
      if (!testCase.description || !testCase.expectedResult || !testCase.actualResult) return false;
    }
    return true;
  };

  const handleGeneratePDF = async () => {
    if (!isFormValid()) return;
    await generatePDF(generalInfo, testCases, {
      total: testCases.length,
      approved: testCases.filter(tc => tc.status === 'Aprovado').length,
      rejected: testCases.filter(tc => tc.status === 'Reprovado').length,
      coverage: testCases.length > 0 ? ((testCases.filter(tc => tc.status === 'Aprovado').length / testCases.length) * 100).toFixed(1) : '0.0',
      summaryNotes
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h3" component="h1">
                Relatório de Evidências de Testes de Software
              </Typography>
            </Box>
            <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleGeneratePDF}
                disabled={!isFormValid()}
              >
                Baixar Relatório
              </Button>
            <Paper elevation={3} sx={{
              mt: 4,
              backgroundColor: '#ffffff',
              height: '800px',
              width: '1300px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="test evidence tabs"
                  variant="fullWidth"
                  sx={{ minHeight: 64 }}
                >
                  <Tab label="Informações e Escopo" sx={{ minHeight: 64, fontSize: 18 }} />
                  <Tab label="Testes" sx={{ minHeight: 64, fontSize: 18 }} />
                  <Tab label="Resumo" sx={{ minHeight: 64, fontSize: 18 }} />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <GeneralInfo
                  generalInfo={generalInfo}
                  setGeneralInfo={setGeneralInfo}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                  <TestCases
                    testCases={testCases}
                    setTestCases={setTestCases}
                  />
                </Box>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <SummaryTab testCases={testCases} summaryNotes={summaryNotes} setSummaryNotes={setSummaryNotes} />
                
              </TabPanel>
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
