import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'font-awesome/css/font-awesome.min.css' // Ensure your project is capable of handling css files
import { aliases, fa } from 'vuetify/iconsets/fa4'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa
    }
  }
})

createApp(App).use(vuetify).mount('#app')
