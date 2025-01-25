document.addEventListener('DOMContentLoaded', function () {
    // Bloqueia o arrastar de elementos (imagens, textos, etc.)
    document.addEventListener('dragstart', function (event) {
      event.preventDefault();
    });
  
    // Bloqueia a seleção de texto
    document.addEventListener('selectstart', function (event) {
      event.preventDefault();
    });
  
    // Bloqueia o clique com botão direito (context menu)
    document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });
  
    // Bloqueia copiar, recortar e colar
    document.addEventListener('copy', function (event) {
      event.preventDefault();
      alert('Cópia desativada!');
    });
  
    document.addEventListener('cut', function (event) {
      event.preventDefault();
      alert('Corte desativado!');
    });
  
    document.addEventListener('paste', function (event) {
      event.preventDefault();
      alert('Colagem desativada!');
    });
  
    // Bloqueia arrasto específico para imagens
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.setAttribute('draggable', 'false');
    });
  
    console.log('Proteção contra cópia e arrasto ativada.');
  });
  