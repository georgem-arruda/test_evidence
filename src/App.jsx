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
  Button
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

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [generalInfo, setGeneralInfo] = useState({
    product: '',
    version: '',
    date: '',
    responsible: '',
    objective: ''
  });
  const [testCases, setTestCases] = useState([
    {
      id: 1,
      description: '',
      expectedResult: '',
      actualResult: '',
      status: 'Selecione o status',
      evidence: null
    }
  ]);

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
    await generatePDF(generalInfo, testCases);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h3" component="h1">
                Test Evidence Management System
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleGeneratePDF}
                disabled={!isFormValid()}
              >
                Baixar Relatório
              </Button>
            </Box>

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
                  <Tab label="Resumo" sx={{ minHeight: 64, fontSize: 18 }} />
                  <Tab label="Informações e Escopo" sx={{ minHeight: 64, fontSize: 18 }} />
                  <Tab label="Testes" sx={{ minHeight: 64, fontSize: 18 }} />
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
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
