/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primeiracor: '#df1b05', // cor personalizada
        segundacor: '#00773e', // cor personalizada
        terceiracor: '#ffffff', // cor personalizada
        quartacor: '#ff8200', // cor personalizada (corrigido o erro de duplo #)
        quintacor: '#000000', // cor personalizada
      },
      fontFamily: {
        'sans': ['Overlock', 'sans-serif']
      },
      backgroundImage: {
        "home": "url('/assets/fundo.webp')",
        "categoriasbg": "url('/assets/bannercategorias.webp')"
      }
    },
  },
  plugins: [],
}
