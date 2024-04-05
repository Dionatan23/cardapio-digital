const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModal = document.getElementById("close-modal");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const observacoes = document.getElementById("observacoes");
const obsWarn = document.getElementById("obs-warn");

let cart = [];

// Abre o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal do carrinho
cartModal.addEventListener("click", function (event) {
  if (event.target == cartModal) {
    cartModal.style.display = "none";
  }
});
closeModal.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  //console.log(event.target);
  let parentBtn = event.target.closest(".add-to-cart-btn");
  if (parentBtn) {
    const name = parentBtn.getAttribute("data-name");
    const price = parseFloat(parentBtn.getAttribute("data-price"));

    addToCart(name, price);
  }
});

// Add os items  no carrinho de compras
function addToCart(name, price) {
  const itemInCartIndex = cart.find((item) => item.name === name);

  if (itemInCartIndex) {
    itemInCartIndex.quanty += 1;
  } else {
    cart.push({
      name,
      price,
      quanty: 1,
    });
  }

  Toastify({
    text: "Item adicionado ao carrinho!",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#10b981",
    },
  }).showToast();
  updateCartModal();
}

let total = 0;
function updateCartModal() {
  cartItemsContainer.innerHTML = "";


  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quanty}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-btn" data-name="${item.name}">Remover</butto>
            </div>
        `;

    total  += item.price * item.quanty;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerText = cart.length;
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute(("data-name"));

        removeItem(name);
    }
})

function removeItem(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        if(item.quanty > 1){
            item.quanty -= 1;
            updateCartModal();
            return;
        }
    }

    cart.splice(index, 1);
    Toastify({
      text: "Item removido do carrinho!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    updateCartModal();
}

addressInput.addEventListener("input", function (event){
  let inputValue = event.target.value;

  if(inputValue != ""){
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

observacoes.addEventListener("input", function (event){
  let obsInput = event.target.value;

  if(obsInput != ""){
    observacoes.classList.remove("border-red-500");
    obsWarn.classList.add("hidden");
  }
});


// Finalizar  compra
checkoutBtn.addEventListener("click", function (){
  const isOpen = checkRestaurante();
  
  if(!isOpen) {
    
    Toastify({
      text: "Ops! Restaurante está fechado!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if(cart.length === 0) return;
  if(addressInput.value === "" && observacoes.value ===""){
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    obsWarn.classList.remove("hidden");
    observacoes.classList.add("border-red-500")
    return;
  };


  const cartItems = cart.map(item => {
    return (
      `${item.name}, Quantidade: ${item.quanty}, Preço: R$${item.price}`
    )
  }).join("\n");

  const message = encodeURIComponent(cartItems);
  const phone = "48996049929";
  const infos = `Total R$ ${total.toFixed(2)} - Endereço: ${addressInput.value}`;

  window.open(`https://wa.me/${phone}?text=${message} | ${infos}`, "_blank");

  cart = [];
  updateCartModal();
});

function checkRestaurante() {
  const data = new Date();
  const hora =  data.getHours();
  return hora >= 19 && hora < 23
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurante();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-500");
} else {
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-500");
}