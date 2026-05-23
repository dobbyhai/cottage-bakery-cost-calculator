const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });
const ORDERS_KEY = 'bakery-cost-calculator-orders-v3';
const INVENTORY_KEY = 'bakery-cost-calculator-inventory-v3';
const TEMPLATES_KEY = 'bakery-cost-calculator-templates-v3';

const demoInventory = [
  // Costco starter estimates — verify against local warehouse/receipt prices.
  { id: 'costco-flour', store: 'Costco', name: 'All-purpose flour', packageAmount: 11340, unit: 'g', packageCost: 13.99, source: 'Costco Business / warehouse estimate' },
  { id: 'costco-sugar', store: 'Costco', name: 'Granulated sugar', packageAmount: 11340, unit: 'g', packageCost: 22.99, source: 'Costco Business / warehouse estimate' },
  { id: 'costco-powdered-sugar', store: 'Costco', name: 'Confectioners sugar', packageAmount: 22680, unit: 'g', packageCost: 39.99, source: 'Costco Business listing; local price may vary' },
  { id: 'costco-butter', store: 'Costco', name: 'Unsalted butter', packageAmount: 1814, unit: 'g', packageCost: 15.99, source: 'Costco warehouse estimate' },
  { id: 'costco-eggs', store: 'Costco', name: 'Large eggs', packageAmount: 24, unit: 'each', packageCost: 6.99, source: 'Costco warehouse estimate' },
  { id: 'costco-vanilla', store: 'Costco', name: 'Pure vanilla extract', packageAmount: 473, unit: 'ml', packageCost: 11.99, source: 'Costco warehouse estimate' },
  { id: 'costco-cocoa', store: 'Costco', name: 'Cocoa powder', packageAmount: 709, unit: 'g', packageCost: 13.99, source: 'Costco/Rodelle-style bulk estimate' },
  { id: 'costco-chocolate-chips', store: 'Costco', name: 'Semi-sweet chocolate chips', packageAmount: 2041, unit: 'g', packageCost: 13.99, source: 'Costco Business listing; local price may vary' },

  // Trader Joe’s starter prices — based on public TJ price trackers/guides; verify in-store.
  { id: 'tj-flour', store: "Trader Joe's", name: 'Organic unbleached all-purpose flour', packageAmount: 2268, unit: 'g', packageCost: 5.49, source: 'Trader Joe’s price tracker, 2025' },
  { id: 'tj-sugar', store: "Trader Joe's", name: 'Organic cane sugar', packageAmount: 907, unit: 'g', packageCost: 3.49, source: 'Trader Joe’s baking guide / estimate' },
  { id: 'tj-powdered-sugar', store: "Trader Joe's", name: 'Organic powdered cane sugar', packageAmount: 454, unit: 'g', packageCost: 3.29, source: 'Trader Joe’s price tracker, 2025' },
  { id: 'tj-butter', store: "Trader Joe's", name: 'Unsalted butter quarters', packageAmount: 454, unit: 'g', packageCost: 3.99, source: 'Trader Joe’s price tracker, 2025' },
  { id: 'tj-eggs', store: "Trader Joe's", name: 'Pasture raised large brown eggs', packageAmount: 12, unit: 'each', packageCost: 5.99, source: 'Trader Joe’s price tracker, 2025' },
  { id: 'tj-vanilla', store: "Trader Joe's", name: 'Organic pure bourbon vanilla extract', packageAmount: 118, unit: 'ml', packageCost: 9.99, source: 'Trader Joe’s price tracker, 2025' },
  { id: 'tj-cocoa', store: "Trader Joe's", name: 'Cocoa powder', packageAmount: 255, unit: 'g', packageCost: 2.49, source: 'Trader Joe’s baking guide; older price, verify' },
  { id: 'tj-chocolate-chips', store: "Trader Joe's", name: 'Semi-sweet chocolate chips', packageAmount: 340, unit: 'g', packageCost: 3.99, source: 'Trader Joe’s price tracker, 2025' },
  { id: 'tj-chocolate-chunks', store: "Trader Joe's", name: 'Semi-sweet chocolate chunks', packageAmount: 283, unit: 'g', packageCost: 3.49, source: 'Trader Joe’s price tracker, 2025' },

  // Sprouts starter estimates — use as placeholders until receipt-verified.
  { id: 'sprouts-flour', store: 'Sprouts', name: 'All-purpose flour', packageAmount: 2268, unit: 'g', packageCost: 4.99, source: 'Sprouts online/local estimate' },
  { id: 'sprouts-sugar', store: 'Sprouts', name: 'Granulated sugar', packageAmount: 1814, unit: 'g', packageCost: 4.49, source: 'Sprouts online/local estimate' },
  { id: 'sprouts-powdered-sugar', store: 'Sprouts', name: 'Confectioners sugar', packageAmount: 907, unit: 'g', packageCost: 3.99, source: 'Sprouts online/local estimate' },
  { id: 'sprouts-butter', store: 'Sprouts', name: 'Unsalted butter', packageAmount: 454, unit: 'g', packageCost: 5.49, source: 'Sprouts online/local estimate' },
  { id: 'sprouts-eggs', store: 'Sprouts', name: 'Large eggs', packageAmount: 12, unit: 'each', packageCost: 4.99, source: 'Sprouts online/local estimate' },
  { id: 'sprouts-vanilla', store: 'Sprouts', name: 'Pure vanilla extract', packageAmount: 59, unit: 'ml', packageCost: 9.99, source: 'Sprouts online/local estimate' },
  { id: 'sprouts-cocoa', store: 'Sprouts', name: 'Cocoa powder', packageAmount: 226, unit: 'g', packageCost: 5.49, source: 'Sprouts online/local estimate' },
  { id: 'sprouts-chocolate-chips', store: 'Sprouts', name: 'Semi-sweet chocolate chips', packageAmount: 340, unit: 'g', packageCost: 4.99, source: 'Sprouts online/local estimate' },
  { id: 'sprouts-baking-chocolate', store: 'Sprouts', name: 'Baking chocolate bar', packageAmount: 113, unit: 'g', packageCost: 3.49, source: 'Sprouts online/local estimate' },
];

const demoTemplates = [
  {
    id: 'chocolate-cupcakes-components',
    name: 'Chocolate cupcakes with chocolate frosting',
    quantity: 24,
    targetPrice: 72,
    components: [
      {
        id: 'base', name: 'Chocolate cupcake base', needed: 24, yieldQty: 12, yieldUnit: 'cupcakes', rounding: 'partial', source: 'Starter component template',
        ingredients: [
          { inventoryId: 'costco-flour', used: 350 }, { inventoryId: 'costco-sugar', used: 250 },
          { inventoryId: 'costco-butter', used: 170 }, { inventoryId: 'costco-eggs', used: 2 },
          { inventoryId: 'costco-cocoa', used: 42 }, { inventoryId: 'costco-vanilla', used: 5 },
        ],
        labor: [
          { id: 'l1', task: 'Mix batter', type: 'fixed', minutes: 25, qtyBasis: 1, hourlyRate: 18 },
          { id: 'l2', task: 'Scoop batter', type: 'perItem', minutes: 0.5, qtyBasis: 12, hourlyRate: 18 },
          { id: 'l3', task: 'Bake + cool batch', type: 'perBatch', minutes: 35, qtyBasis: 1, hourlyRate: 18 },
        ]
      },
      {
        id: 'frosting', name: 'Chocolate buttercream frosting', needed: 24, yieldQty: 12, yieldUnit: 'cupcakes covered', rounding: 'partial', source: 'Starter component template',
        ingredients: [
          { inventoryId: 'costco-butter', used: 226 }, { inventoryId: 'costco-powdered-sugar', used: 450 },
          { inventoryId: 'costco-cocoa', used: 55 }, { inventoryId: 'costco-vanilla', used: 5 },
        ],
        labor: [
          { id: 'l4', task: 'Make frosting', type: 'fixed', minutes: 20, qtyBasis: 1, hourlyRate: 18 },
          { id: 'l5', task: 'Pipe frosting', type: 'perItem', minutes: 1.2, qtyBasis: 12, hourlyRate: 18 },
        ]
      },
    ],
    orderLabor: [{ id: 'ol1', task: 'Packaging + cleanup', type: 'fixed', minutes: 30, qtyBasis: 1, hourlyRate: 18 }],
    extras: { packaging: 2.5, delivery: 0, fee: 0, other: 0 },
    utilities: { kitchenRate: 2.5, kitchenHours: 3, ovenRate: 1.2, ovenMinutes: 45, fixedOverhead: 1.5 },
  },
];

const state = {
  inventory: JSON.parse(localStorage.getItem(INVENTORY_KEY) || 'null') || structuredClone(demoInventory),
  templates: JSON.parse(localStorage.getItem(TEMPLATES_KEY) || 'null') || structuredClone(demoTemplates),
  orders: JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  components: [],
  orderLabor: [],
};

const $ = (id) => document.getElementById(id);
const number = (value) => Number.parseFloat(value) || 0;
const uid = () => Math.random().toString(36).slice(2, 10);
const round2 = n => Math.round((n + Number.EPSILON) * 100) / 100;

function findInv(id) { return state.inventory.find(i => i.id === id); }
function inventoryUnitCost(item) { return number(item?.packageAmount) > 0 ? number(item.packageCost) / number(item.packageAmount) : 0; }
function scaleFor(component) {
  const raw = number(component.yieldQty) > 0 ? number(component.needed) / number(component.yieldQty) : 1;
  return component.rounding === 'whole' ? Math.ceil(raw) : raw;
}
function ingredientFromLine(line) {
  const inv = findInv(line.inventoryId);
  return inv ? { id: uid(), inventoryId: inv.id, store: inv.store || '', name: inv.name, used: number(line.used), unit: inv.unit || '', packageAmount: number(inv.packageAmount), packageCost: number(inv.packageCost), source: inv.source || '' }
    : { id: uid(), inventoryId: null, store: line.store || '', name: line.name || 'Custom ingredient', used: number(line.used), unit: line.unit || '', packageAmount: number(line.packageAmount) || 1, packageCost: number(line.packageCost) };
}
function lineFromIngredient(i) { return { inventoryId: i.inventoryId, store: i.store, name: i.name, used: number(i.used), unit: i.unit, packageAmount: number(i.packageAmount), packageCost: number(i.packageCost) }; }
function ingredientCost(i, scale = 1) { return number(i.packageAmount) > 0 ? (number(i.used) * scale / number(i.packageAmount)) * number(i.packageCost) : 0; }
function laborMinutes(line, scale = 1, component = null) {
  if (line.type === 'perItem') return number(line.minutes) * number(component?.needed || line.qtyBasis || $('quantity').value);
  if (line.type === 'perBatch') return number(line.minutes) * scale;
  if (line.type === 'perUnit') return number(line.minutes) * number(line.qtyBasis) * scale;
  return number(line.minutes);
}
function laborCost(line, scale = 1, component = null) { return (laborMinutes(line, scale, component) / 60) * number(line.hourlyRate); }
function getExtras() { return { packaging: number($('packagingCost').value), delivery: number($('deliveryCost').value), fee: number($('feeCost').value), other: number($('otherCost').value) }; }
function setExtras(e = {}) { $('packagingCost').value = number(e.packaging).toFixed(2); $('deliveryCost').value = number(e.delivery).toFixed(2); $('feeCost').value = number(e.fee).toFixed(2); $('otherCost').value = number(e.other).toFixed(2); }
function extrasTotal(e = getExtras()) { return number(e.packaging)+number(e.delivery)+number(e.fee)+number(e.other); }
function getUtilities() { return { kitchenRate: number($('kitchenRate').value), kitchenHours: number($('kitchenHours').value), ovenRate: number($('ovenRate').value), ovenMinutes: number($('ovenMinutes').value), fixedOverhead: number($('fixedOverhead').value) }; }
function setUtilities(u = {}) { $('kitchenRate').value = number(u.kitchenRate).toFixed(2); $('kitchenHours').value = number(u.kitchenHours || 0); $('ovenRate').value = number(u.ovenRate).toFixed(2); $('ovenMinutes').value = number(u.ovenMinutes || 0); $('fixedOverhead').value = number(u.fixedOverhead).toFixed(2); }
function utilitiesTotal(u = getUtilities()) { return number(u.kitchenRate)*number(u.kitchenHours) + number(u.ovenRate)*(number(u.ovenMinutes)/60) + number(u.fixedOverhead); }

function totals() {
  let ingredients = 0, labor = 0;
  state.components.forEach(c => {
    const scale = scaleFor(c);
    ingredients += c.ingredients.reduce((s,i)=>s+ingredientCost(i, scale),0);
    labor += c.labor.reduce((s,l)=>s+laborCost(l, scale, c),0);
  });
  labor += state.orderLabor.reduce((s,l)=>s+laborCost(l, 1, null),0);
  const extras = extrasTotal();
  const utilities = utilitiesTotal();
  const total = ingredients + labor + extras + utilities;
  const price = number($('priceCharged').value);
  const quantity = Math.max(1, number($('quantity').value));
  const profit = price - total;
  const margin = price > 0 ? profit / price : 0;
  return { ingredients, labor, extras, utilities, total, price, quantity, profit, margin, suggestedPrice: total / 0.5 };
}

function renderTemplatePicker() { $('recipePicker').innerHTML = state.templates.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join(''); }
function renderRecipes() {
  $('recipesList').innerHTML = state.templates.map(t => `<article class="recipe-card"><div><h3>${escapeHtml(t.name)}</h3><div class="order-meta">${t.quantity} items · ${(t.components||[]).length} components</div></div><div class="recipe-card-actions"><button class="secondary small" data-load-template="${t.id}">Load</button><button class="danger" data-delete-template="${t.id}">Delete</button></div></article>`).join('') || '<p class="muted">No templates yet.</p>';
  renderTemplatePicker();
}
function renderInventoryPickerOptions() { return state.inventory.slice().sort((a,b)=>(a.store+a.name).localeCompare(b.store+b.name)).map(i => `<option value="${i.id}">${escapeHtml(i.store || 'Store')} · ${escapeHtml(i.name)} · ${currency.format(inventoryUnitCost(i))}/${escapeHtml(i.unit || 'unit')}</option>`).join(''); }
function renderComponents() {
  $('componentsList').innerHTML = state.components.map(c => {
    const scale = scaleFor(c);
    const ingCost = c.ingredients.reduce((s,i)=>s+ingredientCost(i, scale),0);
    const labCost = c.labor.reduce((s,l)=>s+laborCost(l, scale, c),0);
    return `<article class="component-card" data-component-id="${c.id}">
      <div class="component-head">
        <label>Component name<input data-component-field="name" value="${escapeHtml(c.name)}" /></label>
        <label>Needed<input data-component-field="needed" type="number" min="0" step="0.01" value="${c.needed}" /></label>
        <label>Recipe yield<input data-component-field="yieldQty" type="number" min="0" step="0.01" value="${c.yieldQty}" /></label>
        <label>Yield unit<input data-component-field="yieldUnit" value="${escapeHtml(c.yieldUnit || '')}" /></label>
        <label>Rounding<select data-component-field="rounding"><option value="partial" ${c.rounding!=='whole'?'selected':''}>Allow partial</option><option value="whole" ${c.rounding==='whole'?'selected':''}>Round up batches</option></select></label>
        <button class="danger" data-remove-component="${c.id}">Remove</button>
      </div>
      <div class="component-meta"><span class="pill">Scale ${round2(scale)}x</span><span class="pill">Ingredients ${currency.format(ingCost)}</span><span class="pill">Labor ${currency.format(labCost)}</span></div>
      <label>Source / recipe notes<input data-component-field="source" value="${escapeHtml(c.source || '')}" placeholder="URL, cookbook, or edits" /></label>
      <div class="component-section-title"><h3>Ingredients</h3><div class="component-actions"><select data-ingredient-picker>${renderInventoryPickerOptions()}</select><button class="secondary small" data-add-component-ingredient="${c.id}">+ Use selected</button><button class="secondary small" data-add-custom-ingredient="${c.id}">+ Custom</button></div></div>
      <div class="table-wrap"><table><thead><tr><th>Ingredient</th><th>Store</th><th>Amount used</th><th>Unit</th><th>Package size</th><th>Package cost</th><th>Scaled cost</th><th></th></tr></thead><tbody>${c.ingredients.map(i => `<tr data-ingredient-id="${i.id}"><td><input data-ingredient-field="name" value="${escapeHtml(i.name)}" /></td><td><input data-ingredient-field="store" value="${escapeHtml(i.store||'')}" /></td><td><input data-ingredient-field="used" type="number" step="0.01" value="${i.used}" /></td><td><input data-ingredient-field="unit" value="${escapeHtml(i.unit||'')}" /></td><td><input data-ingredient-field="packageAmount" type="number" step="0.01" value="${i.packageAmount}" /></td><td><input data-ingredient-field="packageCost" type="number" step="0.01" value="${i.packageCost}" /></td><td><strong>${currency.format(ingredientCost(i, scale))}</strong></td><td><button class="danger" data-remove-component-ingredient="${c.id}:${i.id}">Remove</button></td></tr>`).join('')}</tbody></table></div>
      <div class="component-section-title"><h3>Labor</h3><button class="secondary small" data-add-component-labor="${c.id}">+ Add labor</button></div>
      <div class="table-wrap"><table><thead><tr><th>Task</th><th>Type</th><th>Minutes / basis</th><th>Qty basis</th><th>Hourly rate</th><th>Cost</th><th></th></tr></thead><tbody>${laborRows(c.labor, c, 'component')}</tbody></table></div>
    </article>`;
  }).join('');
}
function laborRows(lines, component, scope) {
  const scale = component ? scaleFor(component) : 1;
  return lines.map(l => `<tr data-labor-id="${l.id}"><td><input data-labor-field="task" value="${escapeHtml(l.task)}" /></td><td><select data-labor-field="type"><option value="fixed" ${l.type==='fixed'?'selected':''}>Fixed</option><option value="perItem" ${l.type==='perItem'?'selected':''}>Per item</option><option value="perBatch" ${l.type==='perBatch'?'selected':''}>Per batch</option><option value="perUnit" ${l.type==='perUnit'?'selected':''}>Per unit</option></select></td><td><input data-labor-field="minutes" type="number" step="0.1" value="${l.minutes}" /></td><td><input data-labor-field="qtyBasis" type="number" step="0.01" value="${l.qtyBasis||1}" /></td><td><input data-labor-field="hourlyRate" type="number" step="0.01" value="${l.hourlyRate}" /></td><td><strong>${currency.format(laborCost(l, scale, component))}</strong></td><td><button class="danger" data-remove-labor="${scope}:${component?.id||'order'}:${l.id}">Remove</button></td></tr>`).join('');
}
function renderOrderLabor() { $('orderLaborBody').innerHTML = laborRows(state.orderLabor, null, 'order'); }
function renderInventory() {
  $('inventoryBody').innerHTML = state.inventory.map(i => `<tr data-inventory-id="${i.id}"><td><input data-inventory-field="store" value="${escapeHtml(i.store||'')}" /></td><td><input data-inventory-field="name" value="${escapeHtml(i.name)}" /></td><td><input data-inventory-field="packageAmount" type="number" step="0.01" value="${i.packageAmount}" /></td><td><input data-inventory-field="unit" value="${escapeHtml(i.unit||'')}" /></td><td><input data-inventory-field="packageCost" type="number" step="0.01" value="${i.packageCost}" /></td><td><strong>${currency.format(inventoryUnitCost(i))}/${escapeHtml(i.unit||'unit')}</strong></td><td><button class="danger" data-remove-inventory="${i.id}">Remove</button></td></tr>`).join('');
}
function renderSummary() {
  const t = totals();
  $('ingredientCost').textContent = currency.format(t.ingredients); $('laborCost').textContent = currency.format(t.labor); $('extrasCost').textContent = currency.format(t.extras); $('utilitiesCost').textContent = currency.format(t.utilities); $('totalCost').textContent = currency.format(t.total); $('costPerItem').textContent = currency.format(t.total/t.quantity); $('profit').textContent = currency.format(t.profit); $('margin').textContent = percent.format(t.margin); $('suggestedPrice').textContent = currency.format(t.suggestedPrice);
  const advice=$('pricingAdvice'); advice.className='advice';
  if(t.profit<0){advice.classList.add('bad'); advice.textContent=`This order loses ${currency.format(Math.abs(t.profit))}. Check scale, labor, utilities, and price.`} else {advice.classList.add('good'); advice.textContent=`Estimated profit is ${currency.format(t.profit)} after ingredients, labor, extras, and utilities.`}
}
function renderOrders() { const q=$('searchOrders').value.toLowerCase(); const list=state.orders.filter(o=>`${o.name} ${o.customer} ${o.notes}`.toLowerCase().includes(q)); $('ordersList').innerHTML=list.map(o=>`<article class="order-card"><div><h3>${escapeHtml(o.name||'Untitled order')}</h3><div class="order-meta">${escapeHtml(o.customer||'No customer')} · ${new Date(o.createdAt).toLocaleString()}</div><div class="order-numbers"><span class="pill">Revenue ${currency.format(o.price)}</span><span class="pill">Cost ${currency.format(o.totalCost)}</span><span class="pill">Profit ${currency.format(o.profit)}</span><span class="pill">Margin ${percent.format(o.margin)}</span><span class="pill">${o.components?.length||0} components</span></div></div><button class="danger" data-delete-order="${o.id}">Delete</button></article>`).join('') || '<p class="muted">No saved orders yet.</p>'; }
function renderAll(){ renderRecipes(); renderComponents(); renderOrderLabor(); renderInventory(); renderSummary(); renderOrders(); }
function saveAll(){ localStorage.setItem(INVENTORY_KEY,JSON.stringify(state.inventory)); localStorage.setItem(TEMPLATES_KEY,JSON.stringify(state.templates)); localStorage.setItem(ORDERS_KEY,JSON.stringify(state.orders)); }
function loadTemplate(id){ const t=state.templates.find(x=>x.id===id); if(!t)return; $('orderName').value=t.name; $('customerName').value=''; $('quantity').value=t.quantity; $('priceCharged').value=t.targetPrice; state.components=(t.components||[]).map(c=>({ ...structuredClone(c), id: uid(), ingredients:(c.ingredients||[]).map(ingredientFromLine), labor:(c.labor||[]).map(l=>({...l,id:uid()})) })); state.orderLabor=(t.orderLabor||[]).map(l=>({...l,id:uid()})); setExtras(t.extras); setUtilities(t.utilities); renderAll(); }
function currentTemplate(){ return { id: uid(), name:$('orderName').value.trim()||'Untitled template', quantity:number($('quantity').value), targetPrice:number($('priceCharged').value), components: state.components.map(c=>({ ...c, ingredients:c.ingredients.map(lineFromIngredient), labor:c.labor.map(l=>({task:l.task,type:l.type,minutes:number(l.minutes),qtyBasis:number(l.qtyBasis),hourlyRate:number(l.hourlyRate)})) })), orderLabor: state.orderLabor.map(l=>({task:l.task,type:l.type,minutes:number(l.minutes),qtyBasis:number(l.qtyBasis),hourlyRate:number(l.hourlyRate)})), extras:getExtras(), utilities:getUtilities() }; }
function saveCurrentTemplate(){ const t=currentTemplate(); const i=state.templates.findIndex(x=>x.name.toLowerCase()===t.name.toLowerCase()); if(i>=0){t.id=state.templates[i].id; state.templates[i]=t}else state.templates.unshift(t); saveAll(); $('saveStatus').textContent='Template saved.'; setTimeout(()=>$('saveStatus').textContent='',1800); renderRecipes(); }
function saveOrder(){ const t=totals(); const order={ id:uid(), createdAt:new Date().toISOString(), name:$('orderName').value.trim(), customer:$('customerName').value.trim(), price:t.price, quantity:t.quantity, totalCost:t.total, ingredientCost:t.ingredients, laborCost:t.labor, extrasCost:t.extras, utilitiesCost:t.utilities, profit:t.profit, margin:t.margin, components:structuredClone(state.components), orderLabor:structuredClone(state.orderLabor), extras:getExtras(), utilities:getUtilities(), notes:$('notes').value.trim()}; state.orders.unshift(order); saveAll(); $('saveStatus').textContent='Order saved.'; setTimeout(()=>$('saveStatus').textContent='',1800); renderOrders(); }
function addComponent(){ state.components.push({id:uid(), name:'New component', needed:number($('quantity').value)||1, yieldQty:number($('quantity').value)||1, yieldUnit:'items', rounding:'partial', source:'', ingredients:[], labor:[]}); renderAll(); }
function escapeHtml(v){ return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

document.addEventListener('input', e=>{
  const compEl=e.target.closest('[data-component-id]');
  if(compEl){ const c=state.components.find(x=>x.id===compEl.dataset.componentId); if(!c)return;
    const ingRow=e.target.closest('[data-ingredient-id]'); const labRow=e.target.closest('[data-labor-id]');
    if(e.target.dataset.componentField){ const f=e.target.dataset.componentField; c[f]=['name','yieldUnit','rounding','source'].includes(f)?e.target.value:number(e.target.value); }
    else if(ingRow){ const i=c.ingredients.find(x=>x.id===ingRow.dataset.ingredientId); const f=e.target.dataset.ingredientField; i[f]=['name','store','unit'].includes(f)?e.target.value:number(e.target.value); }
    else if(labRow){ const l=c.labor.find(x=>x.id===labRow.dataset.laborId); const f=e.target.dataset.laborField; l[f]=['task','type'].includes(f)?e.target.value:number(e.target.value); }
    renderAll(); return;
  }
  const invRow=e.target.closest('[data-inventory-id]'); if(invRow){ const i=state.inventory.find(x=>x.id===invRow.dataset.inventoryId); const f=e.target.dataset.inventoryField; i[f]=['name','store','unit'].includes(f)?e.target.value:number(e.target.value); saveAll(); renderAll(); return; }
  const orderLabRow=e.target.closest('#orderLaborBody [data-labor-id]'); if(orderLabRow){ const l=state.orderLabor.find(x=>x.id===orderLabRow.dataset.laborId); const f=e.target.dataset.laborField; l[f]=['task','type'].includes(f)?e.target.value:number(e.target.value); renderAll(); return; }
  if(['quantity','priceCharged','packagingCost','deliveryCost','feeCost','otherCost','kitchenRate','kitchenHours','ovenRate','ovenMinutes','fixedOverhead'].includes(e.target.id)) renderSummary();
  if(e.target.id==='searchOrders') renderOrders();
});
document.addEventListener('click', e=>{
  if(e.target.dataset.loadTemplate) return loadTemplate(e.target.dataset.loadTemplate);
  if(e.target.dataset.deleteTemplate){ state.templates=state.templates.filter(t=>t.id!==e.target.dataset.deleteTemplate); saveAll(); return renderAll(); }
  if(e.target.dataset.removeComponent){ state.components=state.components.filter(c=>c.id!==e.target.dataset.removeComponent); return renderAll(); }
  if(e.target.dataset.addComponentIngredient){ const c=state.components.find(x=>x.id===e.target.dataset.addComponentIngredient); const picker=e.target.parentElement.querySelector('[data-ingredient-picker]'); const inv=findInv(picker.value); if(c&&inv)c.ingredients.push(ingredientFromLine({inventoryId:inv.id, used:0})); return renderAll(); }
  if(e.target.dataset.addCustomIngredient){ const c=state.components.find(x=>x.id===e.target.dataset.addCustomIngredient); c.ingredients.push({id:uid(), name:'Custom ingredient', store:'', used:0, unit:'g', packageAmount:1, packageCost:0}); return renderAll(); }
  if(e.target.dataset.removeComponentIngredient){ const [cid,iid]=e.target.dataset.removeComponentIngredient.split(':'); const c=state.components.find(x=>x.id===cid); c.ingredients=c.ingredients.filter(i=>i.id!==iid); return renderAll(); }
  if(e.target.dataset.addComponentLabor){ const c=state.components.find(x=>x.id===e.target.dataset.addComponentLabor); c.labor.push({id:uid(), task:'New labor', type:'fixed', minutes:10, qtyBasis:1, hourlyRate:18}); return renderAll(); }
  if(e.target.dataset.removeLabor){ const [scope,cid,lid]=e.target.dataset.removeLabor.split(':'); if(scope==='component'){ const c=state.components.find(x=>x.id===cid); c.labor=c.labor.filter(l=>l.id!==lid); } else state.orderLabor=state.orderLabor.filter(l=>l.id!==lid); return renderAll(); }
  if(e.target.dataset.removeInventory){ state.inventory=state.inventory.filter(i=>i.id!==e.target.dataset.removeInventory); saveAll(); return renderAll(); }
  if(e.target.dataset.deleteOrder){ state.orders=state.orders.filter(o=>o.id!==e.target.dataset.deleteOrder); saveAll(); return renderOrders(); }
});
$('loadRecipeBtn').addEventListener('click',()=>loadTemplate($('recipePicker').value));
$('saveRecipeBtn').addEventListener('click',saveCurrentTemplate);
$('addBlankRecipeBtn').addEventListener('click',()=>{state.templates.unshift({id:uid(), name:'New order template', quantity:1, targetPrice:0, components:[], orderLabor:[], extras:{}, utilities:{}}); saveAll(); renderAll();});
$('addComponentBtn').addEventListener('click',addComponent);
$('addOrderLaborBtn').addEventListener('click',()=>{state.orderLabor.push({id:uid(), task:'New order labor', type:'fixed', minutes:10, qtyBasis:1, hourlyRate:18}); renderAll();});
$('addInventoryBtn').addEventListener('click',()=>{state.inventory.push({id:uid(), store:'Custom', name:'New ingredient', packageAmount:1, unit:'unit', packageCost:0, source:'Manual'}); saveAll(); renderAll();});
$('saveOrderBtn').addEventListener('click',saveOrder);
$('clearFormBtn').addEventListener('click',()=>{state.components=[]; state.orderLabor=[]; $('orderName').value=''; $('customerName').value=''; $('quantity').value=1; $('priceCharged').value=0; setExtras({}); setUtilities({}); renderAll();});
$('exportCsvBtn').addEventListener('click',()=>{ const headers=['Date','Order','Revenue','Cost','Ingredients','Labor','Extras','Utilities','Profit','Margin']; const rows=state.orders.map(o=>[new Date(o.createdAt).toLocaleString(),o.name,o.price,o.totalCost,o.ingredientCost,o.laborCost,o.extrasCost,o.utilitiesCost,o.profit,o.margin]); const csv=[headers,...rows].map(r=>r.map(c=>`"${String(c??'').replaceAll('"','""')}"`).join(',')).join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='bakery-orders.csv'; a.click(); });
$('resetDemoBtn').addEventListener('click',()=>{ localStorage.removeItem(INVENTORY_KEY); localStorage.removeItem(TEMPLATES_KEY); state.inventory=structuredClone(demoInventory); state.templates=structuredClone(demoTemplates); loadTemplate(state.templates[0].id); saveAll(); });

saveAll();
loadTemplate(state.templates[0]?.id);
renderAll();
