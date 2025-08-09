const moneyFmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
function formatMoney(n){ return moneyFmt.format(Number(n)||0); }

    const PHONE = "528997788333";

    

const BASES = {
  elote_vaso: { name: "Elote en vaso", price: { chico: 20, mediano: 30, grande: 40 } },
  tostielote: { name: "Tostielote", price: 70, sabritas: true },
  chorriado: { name: "Chorriado", price: 85, sabritas: true },
  maruchan_volcan: { name: "Maruchan volcán", price: 130, sabritas: true },
  maruchan_loca: { name: "Maruchan loca", price: 100, sabritas: true },
  elote_empanizado: { name: "Elote empanizado", price: 70, sabritas: true },
  elote_volcan: { name: "Elote volcán", price: 85, sabritas: true },
  elote_entero: { name: "Elote entero", price: 40 },
  chicharron: { name: "Chicharrón preparado", price: 50 }
};
const SABRITAS_PRODUCTS = ['tostielote', 'chorriado', 'maruchan_volcan', 'maruchan_loca', 'elote_empanizado', 'elote_volcan'];



    const TOPPING_PRICE = 0;

    const productoSel = document.getElementById('producto');
    const sizeField = document.getElementById('sizeField');
    const entregaSel = document.getElementById('entrega');
    const direccionField = document.getElementById('direccionField');
    const direccionInput = document.getElementById('direccion');
    const totalEl = document.getElementById('total');
    const cartEl = document.getElementById('cart');

    let cart = [];

    

function updateVisibility(){
  const prod = productoSel.value;
  const hasSizes = (prod === 'elote_vaso');
  const hasSabritas = !!(BASES[prod] && BASES[prod].sabritas);

  // toggle fields
  sizeField.style.display = hasSizes ? '' : 'none';
  const sabField = document.getElementById('sabField');
  if (sabField) {
    sabField.style.display = hasSabritas ? '' : 'none';
    if (!hasSabritas) {
      document.querySelectorAll('input[name="sab"]').forEach(r => r.checked = false);
    }
  }

  // Reset toppings al cambiar producto
  document.querySelectorAll('.toppings input[type="checkbox"]').forEach(cb => cb.checked = false);
  // Reset tamaños si no aplica
  if (!hasSizes) document.querySelectorAll('input[name="tam"]').forEach(r => r.checked = false);

  calcTotal();
}



    
function getSelectedSize(){
  const r = document.querySelector('input[name="tam"]:checked');
  return r ? r.value.trim().toLowerCase() : null;
}


    
function getSelectedToppings(){
  return Array.from(document.querySelectorAll('.toppings input[type="checkbox"]:checked'))
    .map(cb => cb.value);
}


    
function calcTotal(){
  const prod = productoSel.value;
  const toppings = getSelectedToppings();
  const sz = getSelectedSize();
  if (!prod || !BASES[prod]) { totalEl.textContent = '0'; return 0; }
  const base = BASES[prod].price;
  let total = 0;
  if (typeof base === 'number') {
    total = base;
  } else if (base && sz) {
    total = base[sz] ?? 0;
  }
  // Toppings no tienen costo, pero mantenemos la lista
  totalEl.textContent = total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  return total;
}
 else {
        base = BASES[prod].price;
      }
      const total = base + toppings.length * TOPPING_PRICE;
      totalEl.textContent = `${formatMoney(total)}`;
      return total;
    }

    
function buildItem(){
  const prod = productoSel.value;
  const sz = getSelectedSize();
  const toppings = getSelectedToppings();
  const entrega = entregaSel.value;
  const direccionInput = document.getElementById('direccion');
  const sabSel = document.querySelector('input[name="sab"]:checked');
  const sabrita = sabSel ? sabSel.value : null;
  const total = calcTotal() || 0;

  return {
    prod,
    name: BASES[prod].name,
    size: sz, // chico/mediano/grande
    sabrita,
    toppings,
    entrega,
    direccion: entrega === 'domicilio' ? (direccionInput?.value.trim() || '') : '',
    total
  }
}

    }

    
function renderCart(){
  if (cart.length === 0) {
    cartEl.innerHTML = '<p class="muted">Tu pedido está vacío.</p>';
    totalGlobalEl.textContent = '0';
    countEl.textContent = '0';
    return;
  }
  const html = cart.map((it, idx) => `
    <div class="cart-item">
      <div>
        <strong>${it.name}</strong>${it.size ? ' ('+it.size+')' : ''} - ${formatMoney(it.total)}<br/>
        ${it.sabrita ? ('Sabrita: ' + it.sabrita + ' · ') : ''}
        Toppings: ${(it.toppings && it.toppings.length ? it.toppings.join(', ') : '—')}
        <br/>Entrega: ${it.entrega}${it.direccion ? ' · ' + it.direccion : ''}
      </div>
      <button class="link" data-remove="${idx}">Quitar</button>
    </div>
  `).join('');
  cartEl.innerHTML = html;

  // Bind remove
  cartEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.onclick = () => {
      const i = parseInt(btn.dataset.remove);
      if (!isNaN(i)) {
        cart.splice(i, 1);
        renderCart();
      }
    };
  });

  // Totals
  const totalGlobal = cart.reduce((acc, it) => acc + (Number(it.total)||0), 0);
  totalGlobalEl.textContent = totalGlobal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  countEl.textContent = cart.length;
}

      const html = cart.map((it, idx) => `
        <div class="cart-item">
          <div>
            <strong>${it.name}</strong> ${it.total}<br/>
            ${it.size ? ('Tamaño: ' + it.size + ' · ') : ''}Toppings: ${it.toppings.join(', ') || '—'}
          </div>
          <button class="link" data-remove="${idx}">Quitar</button>
        </div>
      `).join('');
      cartEl.innerHTML = html;
      cartEl.querySelectorAll('[data-remove]').forEach(btn => btn.onclick = () => {
        const i = parseInt(btn.dataset.remove);
        cart.splice(i,1);
        renderCart();
      });
    }

    document.getElementById('addCart').onclick = () => {
      cart.push(buildItem());
      renderCart();
    };

    document.getElementById('waOrder').onclick = () => {
      const item = buildItem();
      const resumen = `Producto: ${item.name}\n${item.size ? 'Tamaño: ' + item.size + '\n' : ''}Toppings: ${item.toppings.join(', ')||'—'}\nEntrega: ${item.entrega}${item.direccion? '\nDirección: ' + item.direccion : ''}\nTotal: $${item.total}`;
      const url = `https://wa.me/${PHONE}?text=${encodeURIComponent('Hola, quiero pedir:\n' + resumen)}`;
      window.open(url, '_blank');
    };

    productoSel.onchange = updateVisibility;
    entregaSel.onchange = updateVisibility;
    document.querySelectorAll('.toppings input, input[name="tam"]').forEach(i => i.onchange = calcTotal);

    
document.querySelectorAll('.add-menu').forEach(btn => {
  btn.onclick = () => {
    productoSel.value = btn.dataset.item;
    // Reset toppings & sabritas radios
    document.querySelectorAll('.toppings input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="sab"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="tam"]').forEach(r => r.checked = false);
    updateVisibility();
    window.location.hash = '#arma';
  };
});


    updateVisibility();
  

// ===== Theme handling (light/dark) =====
(function(){
  const KEY = 'ek_theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)){
    root.setAttribute('data-theme', 'dark');
  }

  const btn = document.getElementById('themeToggle');
  if (btn){
    btn.onclick = () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem(KEY, isDark ? 'light' : 'dark');
    };
  }
})();
