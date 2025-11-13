/* Dabba Wala static demo app (no backend). 
   Cart and orders use localStorage so you can demo to client.
   Voice address uses Web Speech API (browser support required).
*/

// Sample products (matching images folder)
const products = [
  {id:'apple', category:'Fruits', name:'Apple', price:150, unit:'kg', image:'images/apple.svg'},
  {id:'banana', category:'Fruits', name:'Banana', price:50, unit:'dozen', image:'images/banana.svg'},
  {id:'mango', category:'Fruits', name:'Mango', price:180, unit:'kg', image:'images/mango.svg'},
  {id:'grapes', category:'Fruits', name:'Grapes', price:160, unit:'kg', image:'images/grapes.svg'},
  {id:'orange', category:'Fruits', name:'Orange', price:80, unit:'kg', image:'images/orange.svg'},
  {id:'watermelon', category:'Fruits', name:'Watermelon', price:30, unit:'piece', image:'images/watermelon.svg'},
  {id:'papaya', category:'Fruits', name:'Papaya', price:45, unit:'kg', image:'images/papaya.svg'},
  {id:'pomegranate', category:'Fruits', name:'Pomegranate', price:160, unit:'kg', image:'images/pomegranate.svg'},

  {id:'tomato', category:'Vegetables', name:'Tomato', price:50, unit:'kg', image:'images/tomato.svg'},
  {id:'onion', category:'Vegetables', name:'Onion', price:40, unit:'kg', image:'images/onion.svg'},
  {id:'potato', category:'Vegetables', name:'Potato', price:30, unit:'kg', image:'images/potato.svg'},
  {id:'carrot', category:'Vegetables', name:'Carrot', price:60, unit:'kg', image:'images/carrot.svg'},
  {id:'beans', category:'Vegetables', name:'Beans', price:80, unit:'kg', image:'images/beans.svg'},
  {id:'cauliflower', category:'Vegetables', name:'Cauliflower', price:60, unit:'piece', image:'images/cauliflower.svg'},
  {id:'brinjal', category:'Vegetables', name:'Brinjal', price:50, unit:'kg', image:'images/brinjal.svg'},
  {id:'bhindi', category:'Vegetables', name:'Okra (Bhindi)', price:55, unit:'kg', image:'images/bhindi.svg'},
  {id:'spinach', category:'Vegetables', name:'Spinach', price:30, unit:'bunch', image:'images/spinach.svg'},
  {id:'drumstick', category:'Vegetables', name:'Drumstick', price:70, unit:'kg', image:'images/drumstick.svg'},
  {id:'pumpkin', category:'Vegetables', name:'Pumpkin', price:25, unit:'kg', image:'images/pumpkin.svg'},

  {id:'eggs_country', category:'Eggs', name:'Country Eggs', price:7, unit:'piece', image:'images/eggs_country.svg'},
  {id:'eggs_farm', category:'Eggs', name:'Farm Eggs', price:9, unit:'piece', image:'images/eggs_farm.svg'},

  {id:'chicken', category:'Meat', name:'Chicken', price:220, unit:'kg', image:'images/chicken.svg'},
  {id:'mutton', category:'Meat', name:'Mutton', price:600, unit:'kg', image:'images/mutton.svg'},
  {id:'fish', category:'Meat', name:'Fish', price:300, unit:'kg', image:'images/fish.svg'},

  {id:'cow_milk', category:'Milk', name:'Cow Milk', price:70, unit:'liter', image:'images/cow_milk.svg'},
  {id:'buffalo_milk', category:'Milk', name:'Buffalo Milk', price:65, unit:'liter', image:'images/buffalo_milk.svg'},
  {id:'curd', category:'Milk', name:'Curd', price:60, unit:'kg', image:'images/curd.svg'},
  {id:'paneer', category:'Milk', name:'Paneer', price:320, unit:'kg', image:'images/paneer.svg'},
  {id:'ghee', category:'Milk', name:'Ghee', price:650, unit:'kg', image:'images/ghee.svg'},
  {id:'cheese', category:'Milk', name:'Cheese', price:400, unit:'pack', image:'images/cheese.svg'},

  {id:'honey', category:'Honey', name:'Honey', price:250, unit:'100g', image:'images/honey.svg'},

  {id:'combo_fruit', category:'Paniers', name:'Fruit Combo', price:180, unit:'pack', image:'images/combo_fruit.svg'},
  {id:'combo_veg', category:'Paniers', name:'Veg Combo', price:150, unit:'pack', image:'images/combo_veg.svg'},
  {id:'combo_daily', category:'Paniers', name:'Daily Essentials', price:300, unit:'pack', image:'images/combo_daily.svg'}
];

const categories = ["Fruits","Vegetables","Eggs","Meat","Milk","Honey","Paniers"];

let cart = JSON.parse(localStorage.getItem('dw_cart') || '[]');
updateCartBadge();

function $(id){return document.getElementById(id)}

function buildCategories(){
  const list = $('categoriesList');
  categories.forEach(c => {
    const el = document.createElement('div');
    el.className = 'cat';
    el.textContent = c;
    el.onclick = ()=> showCategory(c);
    list.appendChild(el);
  });
}

function showProducts(list, title){
  $('productsTitle').textContent = title || 'Products';
  const grid = $('productsGrid');
  grid.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    const img = document.createElement('img'); img.src = p.image; img.alt=p.name;
    const h4 = document.createElement('h4'); h4.textContent = p.name;
    const pTag = document.createElement('p'); pTag.textContent = '₹'+p.price+'/'+p.unit;
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Add to Cart';
    btn.onclick = ()=> addToCart(p);
    card.append(img,h4,pTag,btn);
    grid.appendChild(card);
  });
}

function showHome(){
  document.getElementById('hero').scrollIntoView({behavior:'smooth'});
  showProducts(products.slice(0,8), 'Popular Items');
}

function showCategory(name){
  const list = products.filter(p=>p.category===name);
  showProducts(list, name);
  window.scrollTo({top:document.querySelector('#products').offsetTop - 20, behavior:'smooth'});
}

function addToCart(p){
  const existing = cart.find(i=>i.id===p.id);
  if(existing) existing.qty++;
  else cart.push({...p, qty:1});
  localStorage.setItem('dw_cart', JSON.stringify(cart));
  updateCartBadge();
  alert(p.name + ' added to cart');
}

function updateCartBadge(){
  $('cartCount').textContent = cart.reduce((s,i)=>s+i.qty,0);
  // also update summary if checkout visible
  renderOrderSummary();
}

function renderOrderSummary(){
  const out = $('orderSummary');
  if(!out) return;
  if(cart.length===0) { out.innerHTML = '<p>Cart is empty.</p>'; return; }
  let html = '<ul>';
  let total=0;
  cart.forEach(it=>{
    html += `<li>${it.name} x ${it.qty} — ₹${it.price*it.qty}</li>`;
    total += it.price*it.qty;
  });
  html += '</ul><p><strong>Total: ₹'+total+'</strong></p>';
  out.innerHTML = html;
}

// Checkout flow
document.getElementById('shopNow').onclick = ()=> { showHome(); }
document.getElementById('categoriesLink').onclick = ()=> { document.querySelector('#categories').scrollIntoView({behavior:'smooth'}); }
document.getElementById('cartLink').onclick = ()=> { openCheckout(); }

function openCheckout(){
  if(cart.length===0){ alert('Cart is empty. Add items first.'); return; }
  document.getElementById('checkoutArea').classList.remove('hidden');
  renderOrderSummary();
  window.scrollTo({top:document.querySelector('#checkoutArea').offsetTop - 20, behavior:'smooth'});
}

// Voice address (Web Speech API)
let recognition;
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.onresult = (e)=> {
    const txt = e.results[0][0].transcript;
    const addr = document.getElementById('addressInput');
    addr.value = addr.value ? addr.value + '\n' + txt : txt;
  };
  recognition.onerror = (e)=> console.log('Speech error', e);
}

document.getElementById('voiceBtn').onclick = ()=> {
  if(!recognition){ alert('Voice recognition not supported in this browser. Use Chrome.'); return; }
  recognition.start();
};

// Photo upload preview
document.getElementById('photoInput').onchange = (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  document.getElementById('photoPreview').innerHTML = `<img src="${url}" alt="photo" />`;
};

// Handwrite/draw modal
document.getElementById('drawBtn').onclick = ()=> {
  document.getElementById('drawModal').classList.remove('hidden');
};
document.getElementById('closeDraw').onclick = ()=> document.getElementById('drawModal').classList.add('hidden');
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let drawing=false;
canvas.onpointerdown = (e)=> { drawing=true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); }
canvas.onpointermove = (e)=> { if(!drawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle='#2c3e50'; ctx.lineWidth=3; ctx.stroke(); }
canvas.onpointerup = ()=> drawing=false;
document.getElementById('clearDraw').onclick = ()=> ctx.clearRect(0,0,canvas.width,canvas.height);
document.getElementById('saveDraw').onclick = ()=> {
  const data = canvas.toDataURL('image/png');
  document.getElementById('photoPreview').innerHTML = `<img src="${data}" alt="handwrite" />`;
  document.getElementById('drawModal').classList.add('hidden');
};

// Place order (simulate saving order and show tracking)
document.getElementById('placeOrderBtn').onclick = ()=> {
  const addr = document.getElementById('addressInput').value.trim();
  if(!addr){ alert('Please enter delivery address'); return; }
  const payment = document.getElementById('paymentSelect').value;
  const orderId = 'DW' + Date.now().toString().slice(-6);
  const order = { id: orderId, items: cart, address: addr, payment, status: 'Received', created: Date.now() };
  // save order history to localStorage
  const orders = JSON.parse(localStorage.getItem('dw_orders')||'[]');
  orders.push(order);
  localStorage.setItem('dw_orders', JSON.stringify(orders));
  // clear cart
  cart = [];
  localStorage.setItem('dw_cart', JSON.stringify(cart));
  updateCartBadge();
  document.getElementById('checkoutArea').classList.add('hidden');
  showTracking(orderId);
  simulateTracking(orderId);
  alert('Order placed! Your order id: ' + orderId);
};

function showTracking(orderId){
  document.getElementById('trackingArea').classList.remove('hidden');
  const info = document.getElementById('trackingInfo');
  const orders = JSON.parse(localStorage.getItem('dw_orders')||'[]');
  const order = orders.find(o=>o.id===orderId) || orders[orders.length-1];
  if(!order){ info.innerHTML='Order not found'; return; }
  info.innerHTML = `<p>Order <strong>${order.id}</strong></p>
    <p>Status: <span id="trackStatus">${order.status}</span></p>
    <p>Address: ${order.address.replace(/\\n/g,'<br/>')}</p>`;
}

// Simulate status updates every 5 seconds (demo)
function simulateTracking(orderId){
  const statuses = ['Received','Packed','Out for delivery','Delivered'];
  let i=0;
  const interval = setInterval(()=>{
    const orders = JSON.parse(localStorage.getItem('dw_orders')||'[]');
    const order = orders.find(o=>o.id===orderId);
    if(order && i<statuses.length){
      order.status = statuses[i];
      localStorage.setItem('dw_orders', JSON.stringify(orders));
      const sEl = document.getElementById('trackStatus');
      if(sEl) sEl.textContent = order.status;
      i++;
      if(order.status==='Delivered') clearInterval(interval);
    } else {
      clearInterval(interval);
    }
  },5000);
}

// Init UI
buildCategories();
showHome();
renderOrderSummary();
