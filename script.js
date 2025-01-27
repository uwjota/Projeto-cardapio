const menu = document.getElementById("menu");
const cartPedido = document.getElementById("cart-pedido");
const cartMenu = document.getElementById("cart-menu");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total");
const finalizarPedido = document.getElementById("finalizar-pedido");
const fecharMenu = document.getElementById("fechar-menu");
const cartValor = document.getElementById("cart-valor");

let cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera o carrinho do localStorage

// Salva o carrinho no localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Abrir o Pedido
cartPedido.addEventListener("click", function () {
    cartMenu.style.display = "flex";
    updateCartModal();
});

// Fechar o Pedido
cartMenu.addEventListener("click", function (event) {
    if (event.target === cartMenu) {
        cartMenu.style.display = "none";
    }
});

// Fechar o Pedido no botão
fecharMenu.addEventListener("click", function () {
    cartMenu.style.display = "none";
});

// Pegar o nome e o preço ao clicar no botão
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-cart");
    if (parentButton) {
        const nome = parentButton.getAttribute("data-name");
        const preco = parseFloat(parentButton.getAttribute("data-prince"));

        // Adicionar Pedido
        addToCart(nome, preco);
    }
});

// Função para adicionar
function addToCart(nome, preco) {
    const existeItem = cart.find(item => item.nome === nome);

    if (existeItem) {
        existeItem.quantidade += 1;
    } else {
        cart.push({
            nome,
            preco,
            quantidade: 1,
        });
    }

    saveCart(); // Salva no localStorage
    updateCartModal();
}

// Atualizar pedido
function updateCartModal() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartElement = document.createElement("div");
        cartElement.classList.add("flex", "justify-between", "mb-2", "flex-col");

        cartElement.innerHTML = `
            <div class="flex items-center justify-evenly">
                <div>
                    <p class="text-white text-2xl font-semibold md:text-3xl">${item.nome}</p>
                    <p class="text-white text-xl font-bold md:text-2xl">R$ ${item.preco.toFixed(2)}</p>
                </div>
                <p class="text-white text-1xl md:text-2xl">Qtd: ${item.quantidade}</p>
                <button class="text-white remove-cart-btn font-bold bg-red-700 p-3 text-1xl rounded-lg hover:bg-red-500 duration-300 md:text-2xl" data-name="${item.nome}">Remover</button>
            </div>
        `;

        total += item.preco * item.quantidade;

        cartItems.appendChild(cartElement);
    });

    totalPrice.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cartValor.textContent = cart.length;

    // Verifica se o carrinho tem itens e mostra ou esconde o botão de confirmar pedido
    if (cart.length > 0) {
        cartPedido.classList.remove('hidden');
    } else {
        cartPedido.classList.add('hidden');
    }
}

updateCartModal();

// Função para remover Pedido
cartItems.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-cart-btn")) {
        const nome = event.target.getAttribute("data-name");
        removeItemsCard(nome);
    }
});

function removeItemsCard(nome) {
    const index = cart.findIndex(item => item.nome === nome);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantidade > 1) {
            item.quantidade -= 1;
        } else {
            cart.splice(index, 1);
        }
        saveCart(); // Salva no localStorage
        updateCartModal();
    }
}

// Finalizar pedido
finalizarPedido.addEventListener("click", function () {
    const isOpen = checkRestaurante();
    if (!isOpen) {
        Toastify({
            text: "Fechado no Momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: '#df1b05',
            },
            onClick: function () { } // Callback after click
        }).showToast();
        return;
    }

    if (cart.length === 0) {
        Toastify({
            text: "Adicione itens antes de finalizar o pedido.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: '#df1b05',
            },
            onClick: function () { } // Callback after click
        }).showToast();
        return;
    }

    const inputEndereco = document.getElementById("endereco");
    const inputAlteracao = document.getElementById("alteracao");
    const secelctMetodo = document.getElementById("metodo-pagamento")

    if (inputEndereco.value === "") {
        Toastify({
            text: "Digite seu endereço!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: '#df1b05',
            },
            onClick: function () { } // Callback after click
        }).showToast();
        return;
    }

    // Enviar O Pedido para WhatsApp
    const cartItems = cart.map((item) => {
        return (
            `Novo Pedido de: ${item.nome} Quantidade: (${item.quantidade}) Preço: R$${item.preco} | `
        );
    }).join(" ");

    const mensage = encodeURIComponent(cartItems);
    const phone = "18997747933";

    Toastify({
        text: "Seu pedido foi enviado com sucesso",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: '#00773e',
        },
        onClick: function () { } // Callback after click
    }).showToast();

    window.open(`https://wa.me/${phone}?text=${mensage} Endereço: ${inputEndereco.value} | Alteração: ${inputAlteracao.value} | Metodo de pagamento: ${secelctMetodo.value}`, "_blank");

    cart = [];
    saveCart(); // Salva o carrinho vazio
    updateCartModal();
});

// Verificação do Atendimento
function checkRestaurante() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 19 && hora < 0o0;
    // Restaurante aberto
}

const spanItem = document.getElementById("data-hora");
const isOpen = checkRestaurante();

if (isOpen) {
    spanItem.classList.remove("bg-orange-600");
    spanItem.classList.add("bg-green-700");
} else {
    spanItem.classList.remove("bg-green-700");
    spanItem.classList.add("bg-orange-600");
}



const slider = document.querySelector('#category-slider');
const scrollbar = document.querySelector('#scrollbar');
const items = document.querySelectorAll('.slide-item');
let isMouseDown = false;
let startX;
let scrollLeft;
let userInteracting = false;
let interactionTimeout;

// Função para atualizar a opacidade dos itens
function updateOpacity() {
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const containerRect = slider.getBoundingClientRect();
        if (rect.right > containerRect.right || rect.left < containerRect.left) {
            item.style.opacity = '0.4';
        } else {
            item.style.opacity = '1';
        }
    });
}

// Função para atualizar a barra de rolagem
function updateScrollbar() {
    const scrollLeft = slider.scrollLeft;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    const scrollPercentage = scrollLeft / maxScrollLeft;
    scrollbar.style.transform = `scaleX(${scrollPercentage})`;
}

// Resetar o timer para autoSlide
function resetAutoSlideTimer() {
    clearTimeout(interactionTimeout);
    userInteracting = true;
    interactionTimeout = setTimeout(() => {
        userInteracting = false;
    }, 5000); // 5 segundos sem interação
}

// Funcionalidade de arrasto com o mouse
slider.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    resetAutoSlideTimer();
});

slider.addEventListener('mouseleave', () => {
    isMouseDown = false;
});

slider.addEventListener('mouseup', () => {
    isMouseDown = false;
});

slider.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
    resetAutoSlideTimer();
});

// Evento de rolagem
slider.addEventListener('scroll', () => {
    updateOpacity();
    updateScrollbar();
    resetAutoSlideTimer();
});

// Ajuste no tamanho do slider quando a janela for redimensionada
window.addEventListener('resize', () => {
    updateOpacity();
    updateScrollbar();
});

// Função para rolar automaticamente a cada 6 segundos
function autoSlide() {
    setInterval(() => {
        if (!userInteracting) {
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
            }
        }
    }, 5000);
}

// Inicia o autoSlide
autoSlide();

// Chama as funções de opacidade e barra de rolagem
updateOpacity();
updateScrollbar();
