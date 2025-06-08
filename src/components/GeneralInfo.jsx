import {
  TextField,
  Box,
  Grid,
  Button,
  Typography,
  Divider,
  InputAdornment
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR'; // Para português

function GeneralInfo({ generalInfo, setGeneralInfo }) {
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
        <Typography variant="h6" gutterBottom>
          Informações Gerais
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Produto"
              name="product"
              value={generalInfo.product}
              onChange={handleChange}
              sx={{ backgroundColor: '#ffffff', minWidth: 600 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Versão"
              name="version"
              value={generalInfo.version}
              onChange={handleChange}
              required
              sx={{ backgroundColor: '#ffffff', minWidth: 600 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data"
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
                    required: true,
                    sx: { backgroundColor: '#ffffff' },
                    placeholder: 'DD/MM/AAAA'
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
              rows={4}
              value={generalInfo.objective}
              onChange={handleChange}
              required
              sx={{ backgroundColor: '#ffffff', minWidth: 1200 }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default GeneralInfo 