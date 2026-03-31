import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default createVuetify({
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#1565C0',
                    secondary: '#546E7A',
                    accent: '#FF6F00',
                    error: '#D32F2F',
                    success: '#2E7D32',
                    warning: '#F57F17',
                    info: '#0288D1',
                    background: '#F5F7FA',
                    surface: '#FFFFFF',
                },
            },
        },
    },
    defaults: {
        VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
        VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
        VAutocomplete: { variant: 'outlined', density: 'comfortable', color: 'primary' },
        VTextarea: { variant: 'outlined', density: 'comfortable', color: 'primary' },
        VDataTable: { density: 'comfortable' },
        VCard: { rounded: 'lg' },
        VBtn: { rounded: 'lg' },
        VChip: { rounded: 'lg' },
    },
})
