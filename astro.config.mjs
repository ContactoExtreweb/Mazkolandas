// @ts-check
import { defineConfig } from 'astro/config'
import netlify from '@astrojs/netlify'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: netlify(),
  // ponytail: dominio aún sin comprar; cambiar aquí y en public/robots.txt
  site: 'https://mazkolandas.es',
  devToolbar: { enabled: false },
})
