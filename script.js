const menu = document.getElementById("menu");
const cartPedido = document.getElementById("cart-pedido");
const cartMenu = document.getElementById("cart-menu");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total");
const finalizarPedido = document.getElementById("finalizar-pedido");
const fecharMenu = document.getElementById("fechar-menu");
const cartValor = document.getElementById("cart-valor");


let cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera o carrinho do localStorage


window.location.reload();


window.addEventListener('popstate', () => {
    updateCartModal();
});

updateCartModal();

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



// Função para adicionar ao carrinho
function addToCart(nome, preco) {
    alterarQuantidade(nome, 1, preco);
}

// Atualizar pedido
function updateCartModal() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartElement = document.createElement("div");
        cartElement.classList.add("flex", "justify-between", "mb-4");

        cartElement.innerHTML = `
            <div class="overflow-x-hidden">
                <p class="text-white font-semibold break-words text-2xl">${item.nome}</p>
                <p class="text-white font-bold text-2xl">R$ ${item.preco.toFixed(2)}</p>
            </div>
            <div class="flex items-center gap-4">
                <button 
                    class="decrement-btn bg-vermelho text-white font-bold p-4 rounded-lg hover:bg-red-700 duration-300" 
                    data-name="${item.nome}"
                >−</button>

                <span class="text-white text-xl">${item.quantidade}</span>

                <button 
                    class="increment-btn bg-verde text-white font-bold p-4 rounded-lg hover:bg-green-700 duration-300" 
                    data-name="${item.nome}"
                >+</button>
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

    cartPedido.classList.toggle('hidden', cart.length === 0);
}

// Eventos para manipular quantidade
cartItems.addEventListener("click", function (event) {
    const nome = event.target.getAttribute("data-name");

    if (event.target.classList.contains("increment-btn")) {
        alterarQuantidade(nome, 1);
    }

    if (event.target.classList.contains("decrement-btn")) {
        alterarQuantidade(nome, -1);
    }
});

// Função para alterar quantidade
function alterarQuantidade(nome, delta, preco = 0) {
    let item = cart.find(item => item.nome === nome);

    // Adiciona novo item se não existir e o delta for positivo
    if (!item && delta > 0) {
        cart.push({ nome, preco, quantidade: 0 });
        item = cart[cart.length - 1];
    }

    if (item) {
        item.quantidade += delta;

        // Remove o item se a quantidade for 0 ou menor
        if (item.quantidade <= 0) {
            cart = cart.filter(i => i.nome !== nome);
        }

        // Validação de limite máximo
        const totalQuantidade = cart.reduce((acc, item) => acc + item.quantidade, 0);
        if (totalQuantidade > 60) {
            item.quantidade -= delta;
            Toastify({
                text: "Limite de 60 itens alcançado no carrinho.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                style: {
                    background: '#ff0000',
                }
            }).showToast();
        }
    }

    saveCart();
    updateCartModal();
}



// Função para remover Pedido
cartItems.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-cart-btn")) {
        const nome = event.target.getAttribute("data-name");
        removeItemsCard(nome);
    }
});

// Função para remover item do carrinho
function removeItemsCard(nome) {
    const index = cart.findIndex(item => item.nome === nome);
    if (index !== -1) {
        cart.splice(index, 1); // Remove o item do carrinho
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
                background: '#ff0000',
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
                background: '#ff0000',
            },
            onClick: function () { } // Callback after click
        }).showToast();
        return;
    }

    const inputEndereco = document.getElementById("endereco");
    const inputAlteracao = document.getElementById("alteracao");
    const secelctMetodo = document.getElementById("metodo-pagamento")

    if (secelctMetodo.value === "") {
        Toastify({
            text: "Escolha um método de pagamento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: '#ff0000',
            },
            onClick: function () { } // Callback after click
        }).showToast();
        return;
    }

    if (inputEndereco.value === "") {
        Toastify({
            text: "Digite seu endereço!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: '#ff0000',
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
            background: '#04b300',
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
    return hora >= 6 && hora < 24;
    // Restaurante aberto
}

const spanItem = document.getElementById("data-hora");
const isOpen = checkRestaurante();

if (isOpen) {
    spanItem.classList.remove("bg-vermelho");
    spanItem.classList.add("bg-verde");
} else {
    spanItem.classList.remove("bg-verde");
    spanItem.classList.add("bg-vermelho");
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