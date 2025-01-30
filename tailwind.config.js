/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primeiracor: '#df1b05', // cor personalizada
        segundacor: '#00773e', // cor personalizada
        terceiracor: '#ffffff', // cor personalizada
        quartacor: '#ff8200', // cor personalizada
        quintacor: '#000000', // cor personalizada
        vermelho: '#ff0000', // cor personalizada
        verde: '#04b300', // cor personalizada
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif']
      },
      backgroundImage: {
        "home": "url('/assets/fundo.webp')",
        "categoriasbg": "url('/assets/bannercategorias.webp')"
      }
    },
  },
  plugins: [],
}
