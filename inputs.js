// Seleciona todos os inputs (inclusive para texto, senha, etc.)
const inputs = document.querySelectorAll('input, textarea');

inputs.forEach(input => {
  input.addEventListener('input', () => {
    const maxLength = 60;

    // Verifica o comprimento incluindo espaços, emojis e caracteres especiais
    if ([...input.value].length > maxLength) {
      input.value = [...input.value].slice(0, maxLength).join('');
    }
  });
});