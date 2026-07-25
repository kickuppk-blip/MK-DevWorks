/* ══════════════════════════════════════
   MK DevWorks v3 — pricing.js
   Geo-currency detection + category tabs
══════════════════════════════════════ */
'use strict';

/* ── Currency data ── */
const CURRENCIES = {
  USD:{ sym:'$', name:'US Dollar',      flag:'🇺🇸', rate:1      },
  PKR:{ sym:'Rs',name:'Pakistani Rupee',flag:'🇵🇰', rate:278    },
  GBP:{ sym:'£', name:'British Pound',  flag:'🇬🇧', rate:0.79   },
  EUR:{ sym:'€', name:'Euro',           flag:'🇪🇺', rate:0.92   },
  AED:{ sym:'د.إ',name:'UAE Dirham',   flag:'🇦🇪', rate:3.67   },
  SAR:{ sym:'﷼', name:'Saudi Riyal',   flag:'🇸🇦', rate:3.75   },
  INR:{ sym:'₹', name:'Indian Rupee',  flag:'🇮🇳', rate:83     },
  CAD:{ sym:'C$',name:'Canadian Dollar',flag:'🇨🇦', rate:1.36   },
  AUD:{ sym:'A$',name:'Australian Dollar',flag:'🇦🇺',rate:1.53  },
  BDT:{ sym:'৳', name:'Bangladeshi Taka',flag:'🇧🇩',rate:110   },
  MYR:{ sym:'RM',name:'Malaysian Ringgit',flag:'🇲🇾',rate:4.72 },
  TRY:{ sym:'₺', name:'Turkish Lira',  flag:'🇹🇷', rate:32     },
  NGN:{ sym:'₦', name:'Nigerian Naira',flag:'🇳🇬', rate:1550   },
  KES:{ sym:'KSh',name:'Kenyan Shilling',flag:'🇰🇪',rate:129   },
  EGP:{ sym:'E£',name:'Egyptian Pound',flag:'🇪🇬', rate:31     },
};

/* Country → currency mapping */
const COUNTRY_MAP = {
  US:'USD',GB:'GBP',PK:'PKR',AE:'AED',SA:'SAR',IN:'INR',CA:'CAD',AU:'AUD',
  DE:'EUR',FR:'EUR',IT:'EUR',ES:'EUR',NL:'EUR',PT:'EUR',BE:'EUR',AT:'EUR',
  BD:'BDT',MY:'MYR',TR:'TRY',NG:'NGN',KE:'KES',EG:'EGP',
};

/* Country flags for display */
const COUNTRY_FLAGS = {
  US:'🇺🇸',GB:'🇬🇧',PK:'🇵🇰',AE:'🇦🇪',SA:'🇸🇦',IN:'🇮🇳',CA:'🇨🇦',
  AU:'🇦🇺',DE:'🇩🇪',FR:'🇫🇷',BD:'🇧🇩',MY:'🇲🇾',TR:'🇹🇷',NG:'🇳🇬',KE:'🇰🇪',EG:'🇪🇬',
};

let currentCurrency = 'USD';

/* ── Format a price number ── */
function fmtPrice(usdVal, code) {
  const c    = CURRENCIES[code] || CURRENCIES.USD;
  const raw  = usdVal * c.rate;
  let num;
  if (raw >= 10000)     num = Math.round(raw / 100) * 100;
  else if (raw >= 1000) num = Math.round(raw / 10)  * 10;
  else                  num = Math.round(raw);
  const formatted = num.toLocaleString();
  return { sym: c.sym, num: formatted };
}

/* ── Update all prices on the page ── */
function updatePrices(code) {
  currentCurrency = code;
  const c = CURRENCIES[code] || CURRENCIES.USD;

  document.querySelectorAll('.pc-num').forEach(el => {
    const usd = parseFloat(el.dataset.usd);
    if (!usd) return;
    const { num } = fmtPrice(usd, code);
    el.textContent = num;
    el.classList.remove('flash');
    void el.offsetWidth; // reflow
    el.classList.add('flash');
  });

  document.querySelectorAll('.pc-sym').forEach(el => {
    el.textContent = c.sym;
  });
}

/* ── Geo detect ── */
async function detectCurrency() {
  const flagEl     = document.getElementById('cbFlag');
  const detectedEl = document.getElementById('cbDetected');
  const selectEl   = document.getElementById('currencySelect');

  try {
    const res  = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    const cc   = data.country_code || 'US';
    const cur  = COUNTRY_MAP[cc] || 'USD';
    const flag = COUNTRY_FLAGS[cc] || '🌍';
    const city = data.city ? `${data.city}, ` : '';
    const cname= data.country_name || cc;

    if (flagEl)     flagEl.textContent = flag;
    if (detectedEl) detectedEl.textContent = `${flag} ${city}${cname} — ${CURRENCIES[cur]?.name || cur}`;
    if (selectEl)   selectEl.value = cur;

    updatePrices(cur);
  } catch {
    if (flagEl)     flagEl.textContent = '🌍';
    if (detectedEl) detectedEl.textContent = '🌍 Worldwide — US Dollar (default)';
    updatePrices('USD');
  }
}

/* ── Category tabs ── */
function initPricingTabs() {
  const cats   = document.querySelectorAll('.pcat');
  const panels = document.querySelectorAll('.pricing-panel');

  cats.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;

      cats.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === `panel-${cat}`) p.classList.add('active');
      });

      // Re-init VanillaTilt on newly visible cards
      if (typeof VanillaTilt !== 'undefined') {
        document.querySelectorAll(`#panel-${cat} [data-tilt]`).forEach(el => {
          if (!el._tilt) VanillaTilt.init(el, { max:6, speed:400, glare:true, 'max-glare':0.15 });
        });
      }
    });
  });
}

/* ── Currency select listener ── */
function initCurrencySelect() {
  const sel = document.getElementById('currencySelect');
  if (!sel) return;
  sel.addEventListener('change', () => {
    const code = sel.value;
    const c    = CURRENCIES[code];
    const flagEl     = document.getElementById('cbFlag');
    const detectedEl = document.getElementById('cbDetected');
    if (flagEl)     flagEl.textContent = c?.flag || '🌍';
    if (detectedEl) detectedEl.textContent = `${c?.flag || ''} ${c?.name || code}`;
    updatePrices(code);
  });
}

/* ── Boot ── */
export function initPricing() {
  initPricingTabs();
  initCurrencySelect();
  detectCurrency();
}
