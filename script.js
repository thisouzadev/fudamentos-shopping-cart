const cartItem = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const totalPrice = async () => {
  let total = 0;
  const ol = [...document.querySelectorAll('.cart__item')];
  const array = ol.map((li) => parseFloat(li.innerText.split('$')[1]));
  total = array.reduce((acc, current) => acc + current * 100, 0);
  document.querySelector('.total-price').innerText = total / 100;
};

function saveCartListen() {
  const setItem = document.querySelector(cartItem);
  localStorage.setItem('key', JSON.stringify(setItem.innerHTML));
}

function emptyCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const ol = document.querySelector(cartItem);
    ol.innerHTML = '';
    saveCartListen();
    totalPrice();
  });
}

function cartItemClickListener(event) {
  event.target.remove('li');
  saveCartListen();
  totalPrice();
}

function saveCartListenContinue() {
  const cartItemStorage = JSON.parse(localStorage.getItem('key'));
  const olCaminho = document.querySelector(cartItem);
  olCaminho.innerHTML = cartItemStorage;
  
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(cartItem).appendChild(createCartItemElement(data));
      saveCartListen();
      totalPrice();
    });
};

const pickCar = () => {
  const buttonAddPickCar = document.querySelectorAll('.item__add');
  buttonAddPickCar.forEach((button) => {
    button.addEventListener('click', (event) => {
      const getId = getSkuFromProductItem(event.target.parentElement);
      console.log(getId);
      fetchId(getId);
    });
  });
};
const loading = () => {
  const div = document.createElement('div');
  const body = document.querySelector('body');
  body.appendChild(div);
  div.className = 'loading';
  div.innerText = 'loading...';
};

const removeLoading = () => {
  document.querySelector('.loading').remove();
}; 

const fetchCurrency = () => {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return new Promise((resolve) => {
    fetch(endPoint)
      .then((response) => response.json())
      .then((object) => {
        resolve(object.results);
      });
  });
};

const fetchCurrencyAsyncAwait = async () => {
  loading();
  const data = await fetchCurrency();
  data.forEach(({ id, title, thumbnail }) => {
    const productElement = createProductItemElement(
      id, title, thumbnail,
    );
    document.querySelector('.items').appendChild(productElement);
  });
  totalPrice();
};

window.onload = async function onload() {
  saveCartListenContinue();
  await fetchCurrencyAsyncAwait();
  removeLoading(); 
  pickCar();
  totalPrice();
  emptyCart();
};