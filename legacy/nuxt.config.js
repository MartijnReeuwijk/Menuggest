
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [

  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/pwa',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    ['bootstrap-vue/nuxt', {
      icons: true,
    }],
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  pwa: {
    meta: {
      title: 'Menuggest',
      author: 'Martijn Reeuwijk',
    },
    manifest: {
      name: 'Menuggest',
      short_name: 'Menuggest',
      lang: 'en',
      display: "standalone",
      background_color: "#fff",
      description: "App to assist in making profit driven decisions",
      icons: [{
        "src": "static/favicons.ico/android-icon-48x48.png",
        "sizes": "48x48",
        "type": "image/png"
      }, {
        "src": "static/favicons.ico/android-icon-72x72.png",
        "sizes": "72x72",
        "type": "image/png"
      }, {
        "src": "static/favicons.ico/android-icon-96x96.png",
        "sizes": "96x96",
        "type": "image/png"
      }, {
        "src": "static/favicons.ico/android-icon-144x144.png",
        "sizes": "144x144",
        "type": "image/png"
      }, {
        "src": "static/favicons.ico/android-icon-168x168.png",
        "sizes": "168x168",
        "type": "image/png"
      }, {
        "src": "static/favicons.ico/android-icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      }],
    },
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
