/* ══════════════════════════════════════
   MK DevWorks v3 — main.js  (bulletproof)
   All libs loaded synchronously — no defer race conditions
══════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────
   SAFE WRAPPERS — never crash on missing lib
───────────────────────────────────── */
const hasThree  = typeof THREE       !== 'undefined';
const hasGSAP   = typeof gsap        !== 'undefined';
const hasST     = typeof ScrollTrigger !== 'undefined';
const hasLenis  = typeof Lenis       !== 'undefined';
const hasTilt   = typeof VanillaTilt !== 'undefined';

/* ─────────────────────────────────────
   CURRENCY DATA
───────────────────────────────────── */
const CURRENCIES = {
  USD:{sym:'$',   name:'US Dollar',         flag:'🇺🇸', rate:1},
  PKR:{sym:'Rs',  name:'Pakistani Rupee',   flag:'🇵🇰', rate:278},
  GBP:{sym:'£',   name:'British Pound',     flag:'🇬🇧', rate:0.79},
  EUR:{sym:'€',   name:'Euro',              flag:'🇪🇺', rate:0.92},
  AED:{sym:'AED', name:'UAE Dirham',        flag:'🇦🇪', rate:3.67},
  SAR:{sym:'SAR', name:'Saudi Riyal',       flag:'🇸🇦', rate:3.75},
  INR:{sym:'₹',   name:'Indian Rupee',      flag:'🇮🇳', rate:83},
  CAD:{sym:'C$',  name:'Canadian Dollar',   flag:'🇨🇦', rate:1.36},
  AUD:{sym:'A$',  name:'Australian Dollar', flag:'🇦🇺', rate:1.53},
  BDT:{sym:'Tk',  name:'Bangladeshi Taka',  flag:'🇧🇩', rate:110},
  MYR:{sym:'RM',  name:'Malaysian Ringgit', flag:'🇲🇾', rate:4.72},
  TRY:{sym:'₺',   name:'Turkish Lira',      flag:'🇹🇷', rate:32},
  NGN:{sym:'₦',   name:'Nigerian Naira',    flag:'🇳🇬', rate:1550},
  KES:{sym:'KSh', name:'Kenyan Shilling',   flag:'🇰🇪', rate:129},
  EGP:{sym:'EGP', name:'Egyptian Pound',    flag:'🇪🇬', rate:31},
};
const COUNTRY_CUR = {
  US:'USD',GB:'GBP',PK:'PKR',AE:'AED',SA:'SAR',IN:'INR',CA:'CAD',AU:'AUD',
  DE:'EUR',FR:'EUR',IT:'EUR',ES:'EUR',NL:'EUR',PT:'EUR',BE:'EUR',AT:'EUR',
  IE:'EUR',FI:'EUR',GR:'EUR',BD:'BDT',MY:'MYR',TR:'TRY',NG:'NGN',KE:'KES',EG:'EGP',
};

function fmtPrice(usd, code) {
  const c   = CURRENCIES[code] || CURRENCIES.USD;
  const raw = usd * c.rate;
  const num = raw >= 10000 ? Math.round(raw/100)*100
            : raw >= 1000  ? Math.round(raw/10)*10
            : Math.round(raw);
  return { sym: c.sym, num: num.toLocaleString() };
}

let currentCurrency = 'USD';

function updateAllPrices(code) {
  currentCurrency = code;
  const c = CURRENCIES[code] || CURRENCIES.USD;
  document.querySelectorAll('.pc-num').forEach(el => {
    const usd = parseFloat(el.dataset.usd);
    if (!usd) return;
    el.textContent = fmtPrice(usd, code).num;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  });
  document.querySelectorAll('.pc-sym').forEach(el => { el.textContent = c.sym; });
}

async function detectGeoPrice() {
  const flagEl = document.getElementById('cbFlag');
  const detEl  = document.getElementById('cbDetected');
  const selEl  = document.getElementById('currencySelect');
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 5000);
    const r  = await fetch('https://ipapi.co/json/', { signal: ctrl.signal });
    const d  = await r.json();
    const cc = d.country_code || 'US';
    const cur = COUNTRY_CUR[cc] || 'USD';
    const c   = CURRENCIES[cur] || CURRENCIES.USD;
    const city = d.city ? d.city + ', ' : '';
    if (flagEl) flagEl.textContent = c.flag;
    if (detEl)  detEl.textContent  = c.flag + ' ' + city + (d.country_name||cc) + ' — ' + c.name;
    if (selEl)  selEl.value = cur;
    updateAllPrices(cur);
  } catch {
    if (flagEl) flagEl.textContent = '🌍';
    if (detEl)  detEl.textContent  = '🌍 Worldwide — US Dollar (default)';
    updateAllPrices('USD');
  }
}

/* ─────────────────────────────────────
   BOOT — fires instantly on DOM ready
───────────────────────────────────── */
let lenis = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootSite);
} else {
  bootSite();
}

function bootSite() {
  try { initLenis();         } catch(e) { console.warn('Lenis:', e); }
  try { initThreeHero();     } catch(e) { console.warn('ThreeHero:', e); }
  try { initHologram();      } catch(e) { console.warn('Hologram:', e); }
  try { initNavbar();        } catch(e) { console.warn('Navbar:', e); }
  try { initGSAPAnims();     } catch(e) { console.warn('GSAP:', e); }
  try { initCursor();        } catch(e) { console.warn('Cursor:', e); }
  try { initScrollProg();    } catch(e) { console.warn('ScrollProg:', e); }
  try { initFilmGrain();     } catch(e) { console.warn('Grain:', e); }
  try { initGlitch();        } catch(e) { console.warn('Glitch:', e); }
  try { initTyping();        } catch(e) { console.warn('Typing:', e); }
  try { initStreaks();       } catch(e) { console.warn('Streaks:', e); }
  try { initScrollSpy();     } catch(e) { console.warn('SpyDots:', e); }
  try { initNavOverlay();    } catch(e) { console.warn('NavOverlay:', e); }
  try { initSkillBars();     } catch(e) { console.warn('SkillBars:', e); }
  try { initSkillTabs();     } catch(e) { console.warn('SkillTabs:', e); }
  try { initStaggerCards();  } catch(e) { console.warn('Stagger:', e); }
  try { initHScroll();       } catch(e) { console.warn('HScroll:', e); }
  try { initCaseStudies();   } catch(e) { console.warn('Cases:', e); }
  try { initTestimonials();  } catch(e) { console.warn('Testi:', e); }
  try { initFAQ();           } catch(e) { console.warn('FAQ:', e); }
  try { initScrollTop();     } catch(e) { console.warn('ScrollTop:', e); }
  try { initHeroCounters();  } catch(e) { console.warn('Counters:', e); }
  try { initTheme();         } catch(e) { console.warn('Theme:', e); }
  try { initLang();          } catch(e) { console.warn('Lang:', e); }
  try { initPageTrans();     } catch(e) { console.warn('PageTrans:', e); }
  try { initVanillaTilt();   } catch(e) { console.warn('Tilt:', e); }
  try { initPricingTabs();   } catch(e) { console.warn('Pricing:', e); }
  try { detectGeoPrice();    } catch(e) { console.warn('GeoCur:', e); }
  try { initSmoothAnchors(); } catch(e) { console.warn('Anchors:', e); }
}

/* ─────────────────────────────────────
   LENIS
───────────────────────────────────── */
function initLenis() {
  if (!hasLenis) return;
  lenis = new Lenis({ duration: 1.3, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (hasGSAP && hasST) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

/* ─────────────────────────────────────
   THREE.JS HERO — GLSL smoke + particles + god rays
───────────────────────────────────── */
function initThreeHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || !hasThree) { initFallbackHero(); return; }

  const W = canvas.offsetWidth  || window.innerWidth;
  const H = canvas.offsetHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
  camera.position.z = 30;

  /* ── GLSL Smoke shader ── */
  const smokeMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xff1a1a) } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
      float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.1;a*=0.5;}return v;}
      void main(){
        vec2 uv=vUv*3.0-1.5;
        float n=fbm(uv+uTime*0.07); float n2=fbm(uv*1.8-uTime*0.04+1.7);
        float smoke=smoothstep(0.38,0.72,n*n2*2.0);
        float edge=1.0-smoothstep(0.0,0.5,length(vUv-0.5)*2.0);
        gl_FragColor=vec4(uColor,smoke*edge*0.11);
      }`,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(200, 120), smokeMat));

  /* ── 800-point galaxy ── */
  const pPos = new Float32Array(800 * 3);
  for (let i = 0; i < 800; i++) {
    const th = Math.random() * Math.PI * 2, r = Math.random() * 50 + 5;
    pPos[i*3] = Math.cos(th)*r; pPos[i*3+1] = (Math.random()-.5)*40; pPos[i*3+2] = Math.sin(th)*r - 10;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color:0xff1a1a, size:.7, transparent:true, opacity:.55,
    sizeAttenuation:true, blending:THREE.AdditiveBlending, depthWrite:false,
  })));

  /* ── Grid ── */
  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 80, 28, 18),
    new THREE.MeshBasicMaterial({ color:0xff1a1a, wireframe:true, transparent:true, opacity:.025 })
  );
  grid.rotation.x = -Math.PI / 2.6; grid.position.y = -16;
  scene.add(grid);

  /* ── God-ray orbs ── */
  const orbs = [];
  for (let i = 0; i < 6; i++) {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(3 + Math.random()*4, 8, 8),
      new THREE.MeshBasicMaterial({ color:0xff1a1a, transparent:true, opacity:.03+Math.random()*.04, blending:THREE.AdditiveBlending, depthWrite:false })
    );
    orb.position.set((Math.random()-.5)*70, (Math.random()-.5)*30, (Math.random()-.5)*15-5);
    orb.userData = { sp:Math.random()*.006+.003, ph:Math.random()*Math.PI*2, rx:12+Math.random()*20, ry:6+Math.random()*10, oy:orb.position.y };
    scene.add(orb); orbs.push(orb);
  }

  let mx=0, my=0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX/window.innerWidth  - .5)*2;
    my = (e.clientY/window.innerHeight - .5)*2;
  }, { passive:true });

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
  }, { passive:true });

  const particles = scene.children.find(c => c instanceof THREE.Points);
  let t = 0;
  (function anim() {
    t += .007;
    smokeMat.uniforms.uTime.value = t;
    if (particles) { particles.rotation.y = t*.035; particles.rotation.x = t*.01; }
    grid.material.opacity = .02 + Math.sin(t*.4)*.01;
    camera.position.x += (mx*4 - camera.position.x)*.04;
    camera.position.y += (-my*2 - camera.position.y)*.04;
    camera.lookAt(scene.position);
    orbs.forEach(o => {
      o.position.x = Math.cos(t*o.userData.sp + o.userData.ph)*o.userData.rx;
      o.position.y = o.userData.oy + Math.sin(t*o.userData.sp*1.3)*o.userData.ry;
      o.material.opacity = .02 + Math.abs(Math.sin(t*o.userData.sp*2))*.04;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(anim);
  })();
}

function initFallbackHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth || window.innerWidth; canvas.height = canvas.offsetHeight || window.innerHeight; }
  resize(); window.addEventListener('resize', resize, { passive:true });
  const P = Array.from({length:80}, () => ({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, r:Math.random()*.9+.2, a:Math.random()*.45
  }));
  (function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    P.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>canvas.width) p.vx*=-1; if(p.y<0||p.y>canvas.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,26,26,'+p.a+')'; ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ─────────────────────────────────────
   3D HOLOGRAM MASCOT
───────────────────────────────────── */
function initHologram() {
  const canvas = document.getElementById('hologramCanvas');
  if (!canvas || !hasThree) return;
  const W = canvas.parentElement?.offsetWidth  || 300;
  const H = canvas.parentElement?.offsetHeight || 320;
  canvas.width = W; canvas.height = H;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H); renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W/H, .1, 100);
  camera.position.set(0, 1, 5.5);

  const wireMat = new THREE.MeshBasicMaterial({ color:0xff1a1a, wireframe:true, transparent:true, opacity:.3 });
  const eyeMat  = new THREE.MeshBasicMaterial({ color:0xff1a1a, transparent:true, opacity:.9 });
  const darkMat = new THREE.MeshBasicMaterial({ color:0x0a0000, transparent:true, opacity:.85 });

  const group = new THREE.Group();
  // Head wireframe
  group.add(Object.assign(new THREE.Mesh(new THREE.SphereGeometry(1.1,16,12), wireMat.clone()), {}));
  // Eyes
  [-0.38, 0.38].forEach(x => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.22,8,8), eyeMat.clone());
    eye.position.set(x, .15, .92); group.add(eye);
  });
  // Mask
  const mask = new THREE.Mesh(new THREE.BoxGeometry(1.6,.55,.15), darkMat.clone());
  mask.position.set(0,.1,.78); group.add(mask);
  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(2,2.4,.9), wireMat.clone());
  body.position.set(0,-2,0); group.add(body);
  // Badge
  const badge = new THREE.Mesh(new THREE.BoxGeometry(.8,.4,.1), eyeMat.clone());
  badge.position.set(0,-1.8,.46); badge.material.opacity = .8; group.add(badge);
  // Circuit lines
  const lm = new THREE.LineBasicMaterial({ color:0xff1a1a, transparent:true, opacity:.5 });
  [[-1.1,.4,-1.6,.4],[-1.6,.4,-1.6,-.2],[1.1,.4,1.6,.4],[1.6,.4,1.6,-.2]].forEach(([x1,y1,x2,y2]) => {
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1,y1,0),new THREE.Vector3(x2,y2,0)]);
    group.add(new THREE.Line(g, lm));
  });
  scene.add(group);

  // Halo particles
  const hp = new Float32Array(120*3);
  for(let i=0;i<120;i++){const th=Math.random()*Math.PI*2,r=1.8+Math.random()*.8;hp[i*3]=Math.cos(th)*r;hp[i*3+1]=(Math.random()-.5)*4;hp[i*3+2]=Math.sin(th)*r;}
  const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.BufferAttribute(hp,3));
  scene.add(new THREE.Points(hg, new THREE.PointsMaterial({color:0xff1a1a,size:.06,transparent:true,opacity:.6,blending:THREE.AdditiveBlending})));

  let tRY=0, tRX=0;
  const wrap = document.getElementById('hologramWrap');
  if (wrap) {
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      tRY = ((e.clientX-r.left)/r.width -.5)*.8;
      tRX = -((e.clientY-r.top) /r.height-.5)*.4;
    });
    wrap.addEventListener('mouseleave', () => { tRY=0; tRX=0; });
  }

  let t=0;
  (function anim(){
    t+=.012;
    group.rotation.y += (tRY + Math.sin(t*.5)*.15 - group.rotation.y)*.06;
    group.rotation.x += (tRX + Math.sin(t*.3)*.05 - group.rotation.x)*.06;
    group.position.y  = Math.sin(t*.8)*.12;
    group.children.forEach(c => {
      if (c.material && c.material.color && c.material.color.getHex()===0xff1a1a && c.geometry instanceof THREE.SphereGeometry && c.geometry.parameters.radius < .3)
        c.material.opacity = .6 + Math.sin(t*2)*.3;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(anim);
  })();
}

/* ─────────────────────────────────────
   NAVBAR
───────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const hb  = document.getElementById('hamburger');
  const nll = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive:true });

  hb?.addEventListener('click', () => {
    hb.classList.toggle('open');
    nll?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => { hb?.classList.remove('open'); nll?.classList.remove('open'); });
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+cur));
  }, { passive:true });
}

/* ─────────────────────────────────────
   GSAP ANIMATIONS
───────────────────────────────────── */
function initGSAPAnims() {
  if (!hasGSAP) { fallbackReveal(); return; }
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  // Hero elements are visible by default — no entrance animation needed
  const codeCard = document.getElementById('heroCodeCard');
  // code card just floats via CSS animation

  if (!hasST) return;

  // Section titles character reveal
  document.querySelectorAll('.s-title').forEach(el => {
    const html = el.innerHTML;
    const chars = [];
    el.childNodes.forEach(node => {
      if (node.nodeType === 3) {
        node.textContent.split('').forEach(ch => {
          const s = document.createElement('span');
          s.textContent = ch === ' ' ? '\u00A0' : ch;
          s.style.cssText = 'display:inline-block;opacity:0;transform:translateY(36px)';
          el.insertBefore(s, node);
          chars.push(s);
        });
        node.remove();
      }
    });
    gsap.to(chars, {
      opacity:1, y:0, duration:.55, stagger:.022, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%', once:true }
    });
  });

  // Section labels
  document.querySelectorAll('.s-label').forEach(el => {
    gsap.from(el, { opacity:0, x:-20, duration:.7, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 90%', once:true }
    });
  });

  // Hero parallax
  gsap.to('#heroContent', {
    yPercent:-15, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
  });

  // About grid
  const aboutGrid = document.querySelector('.about-grid');
  if (aboutGrid) {
    gsap.from('.about-left',  { opacity:0, x:-50, duration:.9, ease:'power3.out', scrollTrigger:{ trigger:aboutGrid, start:'top 82%', once:true } });
    gsap.from('.about-right', { opacity:0, x:50,  duration:.9, ease:'power3.out', scrollTrigger:{ trigger:aboutGrid, start:'top 82%', once:true } });
  }
}

function fallbackReveal() {
  // Elements are visible by default, nothing to do
}

/* ─────────────────────────────────────
   SMOOTH ANCHORS
───────────────────────────────────── */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.offsetTop - 76;
      if (lenis) lenis.scrollTo(target, { offset:-76, duration:1.4 });
      else window.scrollTo({ top, behavior:'smooth' });
    });
  });
}

/* ─────────────────────────────────────
   ENHANCED CURSOR
───────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(hover:none)').matches) {
    document.body.style.cursor = 'auto'; return;
  }
  const out   = document.getElementById('c-out');
  const inn   = document.getElementById('c-in');
  const trail = document.getElementById('c-trail');
  if (!out) return;

  let ox=0,oy=0, ix=0,iy=0, tx=0,ty=0, cx=0,cy=0;
  document.addEventListener('mousemove', e => { cx=e.clientX; cy=e.clientY; }, { passive:true });
  (function tick() {
    ox+=(cx-ox)*.1; oy+=(cy-oy)*.1;
    ix+=(cx-ix)*.5; iy+=(cy-iy)*.5;
    tx+=(cx-tx)*.07; ty+=(cy-ty)*.07;
    if (out)   { out.style.left=ox+'px';   out.style.top=oy+'px'; }
    if (inn)   { inn.style.left=ix+'px';   inn.style.top=iy+'px'; }
    if (trail) { trail.style.left=tx+'px'; trail.style.top=ty+'px'; }
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a,button,[data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!out) return;
      out.style.width='52px'; out.style.height='52px';
      out.style.borderColor='var(--red)'; out.style.background='rgba(255,26,26,.07)';
    });
    el.addEventListener('mouseleave', () => {
      if (!out) return;
      out.style.width='36px'; out.style.height='36px';
      out.style.borderColor='rgba(255,26,26,.5)'; out.style.background='transparent';
    });
  });

  // Magnetic pull
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.28}px,${(e.clientY-r.top-r.height/2)*.28}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform=''; });
  });
}

/* ─────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────── */
function initScrollProg() {
  const bar = document.getElementById('scroll-prog');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.width = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive:true });
}

/* ─────────────────────────────────────
   FILM GRAIN
───────────────────────────────────── */
function initFilmGrain() {
  const canvas = document.getElementById('grain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  resize(); window.addEventListener('resize', resize, { passive:true });
  (function draw() {
    const id = ctx.createImageData(canvas.width, canvas.height);
    const d  = id.data;
    for (let i=0;i<d.length;i+=4) { const v=Math.random()*255|0; d[i]=d[i+1]=d[i+2]=v; d[i+3]=16; }
    ctx.putImageData(id,0,0);
    requestAnimationFrame(draw);
  })();
}

/* ─────────────────────────────────────
   GLITCH EFFECT
───────────────────────────────────── */
function initGlitch() {
  const targets = document.querySelectorAll('.glitch-target');
  if (!targets.length) return;
  function trigger() {
    targets.forEach(el => {
      el.classList.add('glitching');
      setTimeout(() => el.classList.remove('glitching'), 180);
    });
    setTimeout(trigger, 3000 + Math.random()*5000);
  }
  setTimeout(trigger, 3000);
}

/* ─────────────────────────────────────
   TYPING EFFECT
───────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const phrases = ['Next.js Applications','SaaS Platforms','E-Commerce Stores','Custom Dashboards','Node.js REST APIs','High-Performance UIs'];
  let pi=0, ci=0, del=false;
  function type() {
    const ph = phrases[pi];
    if (!del) {
      el.textContent = ph.slice(0,++ci);
      if (ci===ph.length) { del=true; setTimeout(type,2200); return; }
      setTimeout(type,55);
    } else {
      el.textContent = ph.slice(0,--ci);
      if (ci===0) { del=false; pi=(pi+1)%phrases.length; setTimeout(type,350); return; }
      setTimeout(type,32);
    }
  }
  setTimeout(type, 800);
}

/* ─────────────────────────────────────
   NEON STREAKS
───────────────────────────────────── */
function initStreaks() {
  const container = document.getElementById('heroStreaks');
  if (!container) return;
  if (!document.getElementById('streak-kf')) {
    const s = document.createElement('style');
    s.id = 'streak-kf';
    s.textContent = '@keyframes streakFly{to{transform:translateX(calc(100vw + 600px));opacity:0}}';
    document.head.appendChild(s);
  }
  function add() {
    const el = document.createElement('div');
    const top=Math.random()*100, len=Math.random()*200+80, dur=Math.random()*3+2, a=(.2+Math.random()*.5).toFixed(2);
    el.style.cssText = `position:absolute;top:${top}%;left:-${len}px;width:${len}px;height:1px;pointer-events:none;
      background:linear-gradient(90deg,transparent,rgba(255,26,26,${a}),transparent);
      box-shadow:0 0 8px rgba(255,26,26,${a*.7});animation:streakFly ${dur}s linear forwards;`;
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once:true });
  }
  add(); setInterval(add, 700);
}

/* ─────────────────────────────────────
   SCROLL SPY DOTS
───────────────────────────────────── */
function initScrollSpy() {
  const dots     = document.querySelectorAll('.spy-dot');
  const sections = document.querySelectorAll('section[id]');
  dots.forEach(d => {
    d.addEventListener('click', () => {
      const target = document.getElementById(d.dataset.section);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset:-76, duration:1.2 });
      else window.scrollTo({ top:target.offsetTop-76, behavior:'smooth' });
    });
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        dots.forEach(d => d.classList.toggle('active', d.dataset.section===e.target.id));
    });
  }, { threshold:.3 });
  sections.forEach(s => io.observe(s));
}

/* ─────────────────────────────────────
   FULLSCREEN NAV OVERLAY
───────────────────────────────────── */
function initNavOverlay() {
  const overlay  = document.getElementById('nav-overlay');
  const hb       = document.getElementById('hamburger');
  const closeBtn = document.getElementById('nvoClose');
  if (!overlay) return;

  function open()  { overlay.classList.add('open'); overlay.removeAttribute('aria-hidden'); }
  function close() { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); hb?.classList.remove('open'); }

  hb?.addEventListener('click', () => {
    if (window.innerWidth <= 900) { overlay.classList.contains('open') ? close() : open(); }
  });
  closeBtn?.addEventListener('click', close);
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ─────────────────────────────────────
   SKILL BARS
───────────────────────────────────── */
function initSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      requestAnimationFrame(() => { e.target.style.width = (e.target.dataset.w||80)+'%'; });
    });
  }, { threshold:.3 });
  document.querySelectorAll('.sk-bar').forEach(b => io.observe(b));
}

/* ─────────────────────────────────────
   SKILL TABS
───────────────────────────────────── */
function initSkillTabs() {
  const tabs  = document.querySelectorAll('.stab');
  const cards = document.querySelectorAll('.skill-card');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const cat = t.dataset.cat;
      cards.forEach(c => c.classList.toggle('hidden', cat!=='all' && c.dataset.cat!==cat));
    });
  });
}

/* ─────────────────────────────────────
   STAGGER CARD REVEAL (3D)
───────────────────────────────────── */
function initStaggerCards() {
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting || e.target.classList.contains('visible')) return;
      setTimeout(() => e.target.classList.add('visible'), i * 55);
    });
  }, { threshold:.1 });
  document.querySelectorAll('.stagger-card').forEach(c => io.observe(c));
}

/* ─────────────────────────────────────
   HORIZONTAL SCROLL — PROJECTS
───────────────────────────────────── */
function initHScroll() {
  const track   = document.getElementById('hscrollTrack');
  const leftBtn = document.getElementById('hsLeft');
  const rightBtn= document.getElementById('hsRight');
  const progEl  = document.getElementById('hsProg');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.proj-card'));
  const total = cards.length;
  let cur = 0;

  function goTo(idx) {
    cur = Math.max(0, Math.min(total-1, idx));
    const gap = parseInt(getComputedStyle(track).gap) || 32;
    const cw  = cards[0]?.offsetWidth || 500;
    track.style.transform = `translateX(-${cur*(cw+gap)}px)`;
    if (progEl) progEl.textContent = `0${cur+1} / 0${total}`;
  }

  leftBtn?.addEventListener('click',  () => goTo(cur-1));
  rightBtn?.addEventListener('click', () => goTo(cur+1));

  // Touch
  let sx=0;
  track.addEventListener('touchstart', e => { sx=e.touches[0].clientX; }, { passive:true });
  track.addEventListener('touchend',   e => { const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50) goTo(dx<0?cur+1:cur-1); });

  // Drag
  let dragging=false, dStart=0;
  track.addEventListener('mousedown', e => { dragging=true; dStart=e.clientX; track.style.transition='none'; e.preventDefault(); });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const gap=32, cw=cards[0]?.offsetWidth||500;
    track.style.transform = `translateX(${-(cur*(cw+gap))+(e.clientX-dStart)}px)`;
  });
  window.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging=false; track.style.transition='';
    const dx = e.clientX - dStart;
    if (dx < -80) goTo(cur+1); else if (dx > 80) goTo(cur-1); else goTo(cur);
  });

  window.addEventListener('resize', () => goTo(cur), { passive:true });
}

/* ─────────────────────────────────────
   CASE STUDIES
───────────────────────────────────── */
function initCaseStudies() {
  document.querySelectorAll('.case-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      if (!body) return;
      const open = body.classList.toggle('open');
      btn.textContent = open ? 'Close Case Study ↑' : 'View Case Study ↓';
    });
  });
}

/* ─────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────── */
function initTestimonials() {
  const track  = document.getElementById('testiTrack');
  const dotsEl = document.getElementById('tDots');
  const prev   = document.getElementById('tPrev');
  const next   = document.getElementById('tNext');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testi-card'));
  const REAL  = cards.length;
  const getVis = () => window.innerWidth > 1100 ? 3 : window.innerWidth > 640 ? 2 : 1;
  let cur=0, timer;

  for (let i=0;i<REAL;i++) {
    const d = document.createElement('div');
    d.className = 't-dot' + (i===0?' active':'');
    d.addEventListener('click', () => goTo(i));
    dotsEl?.appendChild(d);
  }

  function goTo(idx) {
    cur = ((idx%REAL)+REAL)%REAL;
    const vis=getVis(), gap=22, ow=track.parentElement.offsetWidth;
    const cw=(ow-gap*(vis-1))/vis;
    track.style.transform = `translateX(-${cur*(cw+gap)}px)`;
    dotsEl?.querySelectorAll('.t-dot').forEach((d,i) => d.classList.toggle('active', i===cur));
  }

  const go = () => { timer=setInterval(()=>goTo(cur+1), 4500); };
  const stop = () => clearInterval(timer);
  prev?.addEventListener('click', () => goTo(cur-1));
  next?.addEventListener('click', () => goTo(cur+1));
  go();
  track.parentElement.addEventListener('mouseenter', stop);
  track.parentElement.addEventListener('mouseleave', go);

  let sx=0;
  track.addEventListener('touchstart', e=>{sx=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',   e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)goTo(cur+(dx<0?1:-1));});
  window.addEventListener('resize', ()=>goTo(cur), {passive:true});
}

/* ─────────────────────────────────────
   FAQ
───────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      const icon = item.querySelector('.faq-icon');
      if (icon) icon.textContent = open ? '−' : '+';
    });
  });
}

/* ─────────────────────────────────────
   HERO ODOMETER COUNTERS
───────────────────────────────────── */
function initHeroCounters() {
  const strip = document.getElementById('heroStats');
  if (!strip) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.odo[data-target]').forEach(el => {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        const target = +el.dataset.target;
        let v=0;
        const iv = setInterval(() => {
          v = Math.min(v + target/70, target);
          el.style.filter = `blur(${(1-v/target)*2}px)`;
          el.textContent  = Math.floor(v);
          if (v>=target) { clearInterval(iv); el.style.filter=''; }
        }, 22);
      });
    });
  }, { threshold:.5 });
  io.observe(strip);
}

/* ─────────────────────────────────────
   SCROLL TOP
───────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), {passive:true});
  btn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, {duration:1.2});
    else window.scrollTo({top:0, behavior:'smooth'});
  });
}

/* ─────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────── */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('mkdw-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(btn, saved);
  btn.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme');
    const next = curr==='dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mkdw-theme', next);
    updateThemeIcon(btn, next);
  });
}
function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme==='dark'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
}

/* ─────────────────────────────────────
   LANGUAGE TOGGLE EN / Urdu RTL
───────────────────────────────────── */
function initLang() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  let isUrdu = localStorage.getItem('mkdw-lang') === 'ur';
  if (isUrdu) applyLang(true);

  btn.addEventListener('click', () => { isUrdu=!isUrdu; applyLang(isUrdu); });

  function applyLang(urdu) {
    document.documentElement.lang = urdu ? 'ur' : 'en';
    document.documentElement.dir  = urdu ? 'rtl' : 'ltr';
    btn.textContent = urdu ? 'EN' : 'اردو';
    localStorage.setItem('mkdw-lang', urdu ? 'ur' : 'en');
    document.querySelectorAll('[data-en]').forEach(el => {
      const val = el.getAttribute(urdu ? 'data-ur' : 'data-en');
      if (!val) return;
      if (el.children.length === 0) el.textContent = val;
    });
  }
}

/* ─────────────────────────────────────
   PAGE TRANSITIONS
───────────────────────────────────── */
function initPageTrans() {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      curtain.classList.add('entering');
      setTimeout(() => { curtain.classList.remove('entering'); }, 480);
      setTimeout(() => { curtain.classList.add('leaving'); setTimeout(() => curtain.classList.remove('leaving'), 500); }, 480);
    });
  });
}

/* ─────────────────────────────────────
   VANILLA TILT
───────────────────────────────────── */
function initVanillaTilt() {
  if (!hasTilt) return;
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max:7, speed:400, glare:true, 'max-glare':0.12, perspective:900
  });
}

/* ─────────────────────────────────────
   PRICING TABS
───────────────────────────────────── */
function initPricingTabs() {
  const cats   = document.querySelectorAll('.pcat');
  const panels = document.querySelectorAll('.pricing-panel');

  cats.forEach(btn => {
    btn.addEventListener('click', () => {
      cats.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      panels.forEach(p => p.classList.toggle('active', p.id==='panel-'+cat));
      // Stagger new cards
      setTimeout(() => {
        document.querySelectorAll('#panel-'+cat+' .stagger-card:not(.visible)').forEach((c,i) => {
          setTimeout(() => c.classList.add('visible'), i*60);
        });
      }, 50);
    });
  });

  const sel = document.getElementById('currencySelect');
  if (sel) {
    sel.addEventListener('change', () => {
      const code = sel.value;
      const c    = CURRENCIES[code];
      const flagEl = document.getElementById('cbFlag');
      const detEl  = document.getElementById('cbDetected');
      if (flagEl) flagEl.textContent = c?.flag || '🌍';
      if (detEl)  detEl.textContent  = (c?.flag||'') + ' ' + (c?.name||code);
      updateAllPrices(code);
    });
  }
}

/* ─────────────────────────────────────
   SERVICE WORKER
───────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw/service-worker.js').catch(() => {});
  });
}
