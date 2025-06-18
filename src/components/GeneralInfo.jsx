import {
  TextField,
  Box,
  Grid,
  Button,
  Typography,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR'; // Para português

function GeneralInfo({ generalInfo, setGeneralInfo, showFieldErrors, errorFields, refs }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setGeneralInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', generalInfo)
  }

  return (
    <Box sx={{ height: '100%' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Informações Gerais
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Projeto/Produto"
              name="product"
              value={generalInfo.product}
              onChange={handleChange}
              required
              sx={{ backgroundColor: '#ffffff', minWidth: 600 }}
              error={showFieldErrors && !generalInfo.product}
              helperText={showFieldErrors && !generalInfo.product ? 'Campo obrigatório' : ''}
              inputRef={refs?.product}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Versão Testada"
              name="version"
              value={generalInfo.version}
              onChange={handleChange}
              sx={{ backgroundColor: '#ffffff', minWidth: 600 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Execução"
                value={generalInfo.date || null}
                onChange={(newValue) => {
                  setGeneralInfo(prev => ({
                    ...prev,
                    date: newValue
                  }));
                }}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { backgroundColor: '#ffffff' },
                    placeholder: 'DD/MM/AAAA',
                    InputProps: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      )
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Responsável pelo Teste"
              name="responsible"
              value={generalInfo.responsible}
              onChange={handleChange}
              required
              sx={{ backgroundColor: '#ffffff', minWidth: 500 }}
              error={showFieldErrors && !generalInfo.responsible}
              helperText={showFieldErrors && !generalInfo.responsible ? 'Campo obrigatório' : ''}
              inputRef={refs?.responsible}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ backgroundColor: '#ffffff', minWidth: 434 }}>
              <InputLabel id="test-type-label">Tipo de Teste</InputLabel>
              <Select
                labelId="test-type-label"
                label="Tipo de Teste"
                name="testType"
                value={generalInfo.testType || ''}
                onChange={handleChange}
              >
                <MenuItem value="">Selecione o tipo</MenuItem>
                <MenuItem value="Funcional">Funcional</MenuItem>
                <MenuItem value="Unitário">Unitário</MenuItem>
                <MenuItem value="Integração">Integração</MenuItem>
                <MenuItem value="API">API</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ambiente de Teste"
              name="testEnvironment"
              value={generalInfo.testEnvironment || ''}
              onChange={handleChange}
              sx={{ backgroundColor: '#ffffff', minWidth: 288 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sistema Operacional"
              name="os"
              value={generalInfo.os || ''}
              onChange={handleChange}
              sx={{ backgroundColor: '#ffffff', minWidth: 288 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Navegador/Versão"
              name="browser"
              value={generalInfo.browser || ''}
              onChange={handleChange}
              sx={{ backgroundColor: '#ffffff', minWidth: 288 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Banco de Dados"
              name="database"
              value={generalInfo.database || ''}
              onChange={handleChange}
              sx={{ backgroundColor: '#ffffff', minWidth: 288 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Escopo do Teste
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objetivo do Teste"
              name="objective"
              multiline
              rows={10}
              value={generalInfo.objective}
              onChange={handleChange}
              required
              sx={{ backgroundColor: '#ffffff', minWidth: 1225 }}
              error={showFieldErrors && !generalInfo.objective}
              helperText={showFieldErrors && !generalInfo.objective ? 'Campo obrigatório' : ''}
              inputRef={refs?.objective}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default GeneralInfo 