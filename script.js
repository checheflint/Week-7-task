const foodItems = [
  {
    id: 1,
    name: 'Jollof Rice',
    description: 'Well prepared sweet and spicy jollof rice.',
    price: 2500,
    image: 'images/jollof.jpg'
  },
  {
    id: 2,
    name: 'Egusi and Pounded Yam',
    description: 'Rich melon seed soup with assorted meat.',
    price: 2500,
    image: 'images/egusi.jpg'
  },
  {
    id: 3,
    name: 'Eba & Oha Soup',
    description: 'Properly processed cassava with rich Oha soup.',
    price: 2500,
    image: 'images/akpu.jpg'
  },
  {
    id: 4,
    name: 'Suya',
    description: 'Spicy grilled beef with onions and pepper.',
    price: 4000,
    image: 'images/suya.jpg'
  },
  {
    id: 5,
    name: 'Moi Moi',
    description: 'Steamed bean pudding wrapped in leaves.',
    price: 1000,
    image: 'images/moimoi.jpg'
  },
  {
    id: 6,
    name: 'Goat Pepper Soup',
    description: 'Well prepared with amazing spices, very delicious.',
    price: 3000,
    image: 'images/meat.jpg'
  }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayMenuItems() {
  const menu = document.getElementById('menu');
  foodItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>${item.description}</p>
      <p><strong>₦${item.price}</strong></p>
      <button onclick="addToCart(${item.id})">Add to Plate</button>
    `;
    menu.appendChild(card);
  });
}

displayMenuItems();
updateCart();

function addToCart(itemId) {
  const item = foodItems.find(i => i.id === itemId);
  const existing = cart.find(i => i.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById('cart-items');
  cartList.innerHTML = '';

  if (cart.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'Your plate is empty. Add some delicious meals!';
    emptyMessage.style.fontStyle = 'italic';
    emptyMessage.style.color = 'gray';
    emptyMessage.style.padding = '10px';
    cartList.appendChild(emptyMessage);
    
    document.getElementById('total').textContent = 0;
    saveToLocalStorage();
    return;
  }

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: left; gap: 4px;">
        <span>${item.name}:</span>
        <span style="font-size: 0.9em; color: gray; margin-bottom: 8px;">
          (₦${item.price} each)
        </span>
      </div>
      <div style="display: flex; align-items: center; gap: 20px;">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span id="qty-${item.id}">${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    cartList.appendChild(li);
  });

  calculateTotal();
  saveToLocalStorage();
}


function calculateTotal() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  document.getElementById('total').textContent = total;
}

function changeQty(itemId, delta) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== itemId);
  }

  updateCart();
}


document.getElementById('submit-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Please add at least one item to your plate.');
    return;
  }
  const btn = document.getElementById('submit-btn');
  btn.innerHTML = 'Submitting...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = 'Submit Order';
    btn.disabled = false;
    document.getElementById('success-modal').classList.remove('hidden');
    localStorage.removeItem('cart');
    cart = [];
    updateCart();
  }, 2000);
});

document.getElementById('print-btn').addEventListener('click', () => {
  let printContent = 'Order Summary\n\n';
  cart.forEach(item => {
    printContent += `${item.name} x ${item.qty} — ₦${item.qty * item.price}\n`;
  });
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  printContent += `\nTotal: ₦${total}`;
  const win = window.open('', '', 'width=400,height=600');
  win.document.write(`<pre>${printContent}</pre>`);
  win.print();
});

function closeModal() {
  document.getElementById('success-modal').classList.add('hidden');
}

function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
