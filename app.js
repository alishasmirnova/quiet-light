const products = [
  { id: 'flower-candle', category: 'candles', categoryLabel: 'СВЕЧИ РУЧНОЙ РАБОТЫ', name: 'Свеча с сухоцветами', description: 'Нежная свеча с цветами для уютных моментов.', price: 890, image: 'Qo2OTMR7-aQhQzUc4IqTjr8jOeN224wbrhOLP7XhnWmO4-Jymn-4OcDcamvDeMydvmcnGfrODbsDWM-JZJd-4FZH.jpg', alt: 'Две свечи с сухоцветами и деревянными фитилями', tag: 'ДЛЯ УЮТА' },
  { id: 'resin-box', category: 'resin', categoryLabel: 'ИЗДЕЛИЯ ИЗ СМОЛЫ', name: 'Шкатулка «Лепестки»', description: 'Розовая шкатулка с цветочными деталями.', price: 1490, image: 'wsNk5hUxzJIE1If4yfTNYlc4iu5ogu4_Zr7MHVtvfHJ7L6z9rUpKIUzObEUH9FeHr8W2VftN8nY2YxOAEGAAOZ__.jpg', alt: 'Розовая шкатулка из смолы с крышкой', tag: 'ОСОБЕННАЯ ДЕТАЛЬ' },
  { id: 'resin-muse', category: 'resin', categoryLabel: 'ИЗДЕЛИЯ ИЗ СМОЛЫ', name: 'Декор «Муза»', description: 'Фигурное изделие из смолы с цветочным узором.', price: 990, image: 'OIska-iZwpspJMUu4C2ZqCK2_aBKBkAkk0bMMHLG0W85OUAJ2i7F4EMV1IbiDXxOFShYLiE0Cj3ApvmNIFo1Fvyk.jpg', alt: 'Красное фигурное изделие из смолы с розами', tag: 'РУЧНАЯ РАБОТА' },
  { id: 'new-work-1', category: 'resin', categoryLabel: 'ИЗДЕЛИЯ ИЗ СМОЛЫ', name: 'Доска для шахмат «Золотая клетка»', description: 'Шахматная доска ручной работы.', price: 990, image: '3O2qnVgJhxm69ej3zjYjiemlHQLhK41kksf8VYlKQYVU-tbh0ZoXP5ZVC2-GN5MFrG5fa6YnR4X7eZ6XiwPvZ77R.jpg', alt: 'Доска для шахмат «Золотая клетка»', tag: 'РУЧНАЯ РАБОТА' },
  { id: 'new-work-2', category: 'candles', categoryLabel: 'СВЕЧИ РУЧНОЙ РАБОТЫ', name: 'Свечи «Фактурные»', description: 'Свечи ручной работы для уютных моментов.', price: 1290, image: 'RKlFLslLRC4-qZwsA5sn97RluFDzeB9SofWukuZG9eWu80bytSOKkDcGNs1vw2JsLh0HwyC_GziT4o2awpuSBJAX.jpg', alt: 'Свечи «Фактурные»', tag: 'РУЧНАЯ РАБОТА' },
  { id: 'new-work-3', category: 'resin', categoryLabel: 'ИЗДЕЛИЯ ИЗ СМОЛЫ', name: 'Шахматные фигуры «Розовый кварц»', description: 'Шахматные фигуры ручной работы.', price: 1490, image: 'd8WNgJMqvL-332qxDYgV16bDh0gCWTN_HSomGrs_ds_pHOZFlQdig53rYjur0sgHVWwBAimuK-tXyKRPwbPoQueL.jpg', alt: 'Шахматные фигуры «Розовый кварц»', tag: 'РУЧНАЯ РАБОТА' }
];

const productGrid = document.querySelector('#products');
const cartItems = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const cartCount = document.querySelector('[data-cart-count]');
const drawer = document.querySelector('#cart-drawer');
const backdrop = document.querySelector('.drawer-backdrop');
const copyButton = document.querySelector('#copy-order');
const copyStatus = document.querySelector('#copy-status');
const money = amount => `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`;
let cart = {};
let lastFocused = null;

try {
  const saved = JSON.parse(localStorage.getItem('quiet-light-cart') || '{}');
  for (const product of products) {
    if (Number.isSafeInteger(saved[product.id]) && saved[product.id] > 0) cart[product.id] = saved[product.id];
  }
} catch (_) { /* The shop still works when storage is unavailable. */ }

function saveCart() {
  try { localStorage.setItem('quiet-light-cart', JSON.stringify(cart)); } catch (_) { /* Storage is optional. */ }
}

function renderProducts(filter = 'all') {
  productGrid.innerHTML = products.filter(product => filter === 'all' || product.category === filter).map(product => `
    <article class="product-card">
      <div class="product-image"><img src="${product.image}" alt="${product.alt}" loading="lazy"><span class="product-tag">${product.tag}</span></div>
      <div class="product-info"><span class="product-category">${product.categoryLabel}</span><div class="product-title-row"><h3 class="product-title">${product.name}</h3><span class="product-price">${money(product.price)}</span></div><p class="product-description">${product.description}</p><button class="add-button" type="button" data-add="${product.id}" aria-label="Добавить ${product.name} в корзину">В корзину &nbsp; +</button></div>
    </article>`).join('');
}

function renderCart() {
  const selected = products.filter(product => cart[product.id]);
  const count = selected.reduce((sum, product) => sum + cart[product.id], 0);
  const total = selected.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  copyButton.disabled = !count;
  cartItems.innerHTML = selected.length ? selected.map(product => `
    <article class="cart-item"><img src="${product.image}" alt=""><div><h3>${product.name}</h3><p>${money(product.price)} за шт.</p><div class="quantity"><button type="button" data-change="${product.id}" data-delta="-1" aria-label="Уменьшить количество ${product.name}">−</button><span>${cart[product.id]}</span><button type="button" data-change="${product.id}" data-delta="1" aria-label="Увеличить количество ${product.name}">+</button></div></div><button class="remove-item" type="button" data-remove="${product.id}" aria-label="Удалить ${product.name}">×</button></article>`).join('') : '<p class="cart-empty">Здесь пока пусто.<br>Пусть это исправит что-то прекрасное ✳</p>';
  saveCart();
}

function openCart() {
  lastFocused = document.activeElement;
  backdrop.hidden = false;
  drawer.inert = false;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  drawer.querySelector('.close-cart').focus();
}

function closeCart() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.inert = true;
  backdrop.hidden = true;
  document.body.classList.remove('drawer-open');
  copyStatus.textContent = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderProducts(button.dataset.filter);
}));

productGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = button.dataset.add;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  button.textContent = 'Добавлено ✓';
  window.setTimeout(() => { button.textContent = 'В корзину  +'; }, 1200);
});

cartItems.addEventListener('click', event => {
  const change = event.target.closest('[data-change]');
  const remove = event.target.closest('[data-remove]');
  if (change) {
    const id = change.dataset.change;
    cart[id] += Number(change.dataset.delta);
    if (cart[id] <= 0) delete cart[id];
  } else if (remove) {
    delete cart[remove.dataset.remove];
  } else return;
  copyStatus.textContent = '';
  renderCart();
});

document.querySelector('[data-open-cart]').addEventListener('click', openCart);
document.querySelectorAll('[data-close-cart]').forEach(element => element.addEventListener('click', closeCart));
document.addEventListener('keydown', event => {
  if (!drawer.classList.contains('open')) return;
  if (event.key === 'Escape') closeCart();
  if (event.key === 'Tab') {
    const focusable = [...drawer.querySelectorAll('button:not(:disabled), a[href], input, textarea, select')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

copyButton.addEventListener('click', async () => {
  const selected = products.filter(product => cart[product.id]);
  if (!selected.length) return;
  const total = selected.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const text = ['Моя корзина «Тихий свет»:', ...selected.map(product => `${product.name} — ${cart[product.id]} шт. × ${money(product.price)} = ${money(product.price * cart[product.id])}`), `Итого: ${money(total)}`].join('\n');
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'Состав корзины скопирован.';
  } catch (_) {
    copyStatus.textContent = `Не удалось скопировать автоматически. Состав корзины:\n${text}`;
    copyStatus.style.whiteSpace = 'pre-line';
  }
});

renderProducts();
renderCart();
