import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#1c69d4',
                    secondary: '#757575',
                    accent: '#0653b6',
                    error: '#D32F2F',
                    success: '#2E7D32',
                    warning: '#F57F17',
                    info: '#1c69d4',
                    background: '#ffffff',
                    surface: '#ffffff',
                    'on-background': '#262626',
                    'on-surface': '#262626',
                },
            },
        },
    },
    defaults: {
        VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary', rounded: 0 },
        VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary', rounded: 0 },
        VAutocomplete: { variant: 'outlined', density: 'comfortable', color: 'primary', rounded: 0 },
        VTextarea: { variant: 'outlined', density: 'comfortable', color: 'primary', rounded: 0 },
        VDataTable: { density: 'comfortable' },
        VCard: { rounded: 0 },
        VBtn: { rounded: 0 },
        VChip: { rounded: 0 },
        VAlert: { rounded: 0 },
        VDialog: { rounded: 0 },
    },
})
