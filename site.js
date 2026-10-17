/* =====================================================================
   ALMANAQUE DA MARIA · comportamento
   Os textos vêm de conteudo.js. Aqui não precisa mexer.
   ===================================================================== */
(() => {
'use strict';

const C = window.CONTEUDO;
const $ = s => document.querySelector(s);
const el = (tag, cls, texto) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (texto != null) e.textContent = texto;
  return e;
};
const pad = (n, t = 2) => String(n).padStart(t, '0');
const sorteio = arr => arr[Math.floor(Math.random() * arr.length)];
const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hoje = new Date();
const dataExtenso = d => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const vibrar = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (_) {} };

document.title = `Almanaque da ${C.nome}`;
document.querySelectorAll('[data-nome]').forEach(n => n.textContent = C.nome);
document.querySelectorAll('[data-inicial]').forEach(n => n.textContent = C.nome.charAt(0));
$('#dataHoje').textContent = dataExtenso(hoje);
$('#dataColofao').textContent = dataExtenso(hoje);
$('#capaSub').textContent = C.capa.subtitulo;

/* =====================================================================
   LUA (fase real de hoje)
   ===================================================================== */
const SINODICO = 29.530588853;
const LUA_NOVA_REF = Date.UTC(2000, 0, 6, 18, 14);
const faseDa = d => { const p = ((d - LUA_NOVA_REF) / 864e5 % SINODICO) / SINODICO; return p < 0 ? p + 1 : p; };
const iluminacao = p => (1 - Math.cos(2 * Math.PI * p)) / 2;
const NOMES_FASE = ['lua nova', 'lua crescente', 'quarto crescente', 'crescente gibosa', 'lua cheia', 'minguante gibosa', 'quarto minguante', 'lua minguante'];
const nomeFase = p => NOMES_FASE[Math.round(p * 8) % 8];

const CRATERAS = [[70, 72, 14], [118, 60, 9], [128, 112, 17], [84, 128, 10], [104, 92, 6], [62, 104, 7], [140, 82, 6], [100, 146, 8]];
let idLua = 0;
function svgLua(p, cx = 100, cy = 100, r = 90) {
  const id = 'lua' + (idLua++);
  const rx = Math.abs(Math.cos(2 * Math.PI * p)) * r;
  const crescendo = p < .5;
  const d = crescendo
    ? `M${cx} ${cy - r}A${r} ${r} 0 0 1 ${cx} ${cy + r}A${rx} ${r} 0 0 ${p < .25 ? 0 : 1} ${cx} ${cy - r}Z`
    : `M${cx} ${cy - r}A${r} ${r} 0 0 0 ${cx} ${cy + r}A${rx} ${r} 0 0 ${p < .75 ? 0 : 1} ${cx} ${cy - r}Z`;
  const crateras = CRATERAS.map(([x, y, cr]) => `<circle cx="${x * r / 90 + cx - 100 * r / 90}" cy="${y * r / 90 + cy - 100 * r / 90}" r="${cr * r / 90}"/>`).join('');
  return `<defs>
      <radialGradient id="${id}g" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#fdf4d6"/><stop offset=".65" stop-color="#f0dea4"/><stop offset="1" stop-color="#d6bd78"/></radialGradient>
      <clipPath id="${id}c"><path d="${d}"/></clipPath>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#262e4f"/>
    <g fill="#1f2644" opacity=".7">${crateras}</g>
    <path d="${d}" fill="url(#${id}g)"/>
    <g clip-path="url(#${id}c)" fill="#c7ac63" opacity=".42">${crateras}</g>
    <circle cx="${cx}" cy="${cy}" r="${r - .5}" fill="none" stroke="rgba(242,227,179,.22)"/>`;
}

const faseHoje = faseDa(hoje);
const luaSvg = $('#luaSvg');
luaSvg.innerHTML = svgLua(faseHoje);
$('#luaLegenda').textContent =
  `Hoje a lua está ${Math.round(iluminacao(faseHoje) * 100)}% iluminada (${nomeFase(faseHoje)}). ${C.capa.notaLua}`;

// clicar na lua: ela passa por todas as fases
let girando = false;
$('#luaBotao').addEventListener('click', e => {
  if (girando) return;
  girando = true;
  const r = e.currentTarget.getBoundingClientRect();
  confeteDe(r.left + r.width / 2, r.top + r.height / 2, 40, true);
  const inicio = performance.now(), dur = 1800;
  (function passo(t) {
    const k = Math.min(1, (t - inicio) / dur);
    const ease = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    luaSvg.innerHTML = svgLua((faseHoje + ease) % 1);
    if (k < 1) requestAnimationFrame(passo); else girando = false;
  })(inicio);
});

/* ---------- céu da capa ---------- */
(() => {
  const cv = $('#ceu'), ctx = cv.getContext('2d'), capa = $('#capa');
  let estrelas = [], cadentes = [], w, h, dpr;
  function medir() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = capa.offsetWidth; h = capa.offsetHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    estrelas = Array.from({ length: Math.floor(w * h / 5200) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() < .08 ? Math.random() * 1.2 + 1 : Math.random() * .9 + .25,
      f: Math.random() * 6.3, v: Math.random() * .025 + .004,
      cor: Math.random() < .2 ? '242,227,179' : '243,236,223'
    }));
  }
  function quadro() {
    ctx.clearRect(0, 0, w, h);
    for (const s of estrelas) {
      s.f += s.v;
      ctx.fillStyle = `rgba(${s.cor},${.35 + Math.sin(s.f) * .3 + .3})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.3); ctx.fill();
    }
    if (!menosMovimento && Math.random() < .004) cadentes.push({ x: Math.random() * w * .8, y: Math.random() * h * .35, vida: 1 });
    for (const c of cadentes) {
      const g = ctx.createLinearGradient(c.x, c.y, c.x - 90, c.y - 36);
      g.addColorStop(0, `rgba(243,236,223,${c.vida})`); g.addColorStop(1, 'rgba(243,236,223,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - 90, c.y - 36); ctx.stroke();
      c.x += 9; c.y += 3.6; c.vida -= .022;
    }
    cadentes = cadentes.filter(c => c.vida > 0);
    requestAnimationFrame(quadro);
  }
  // no celular a barra do navegador muda a altura ao rolar; só redesenha se mudar de verdade
  addEventListener('resize', () => {
    if (capa.offsetWidth !== w || Math.abs(capa.offsetHeight - h) > 150) medir();
  });
  medir(); quadro();
})();

/* =====================================================================
   CONFETE (papel picado + luazinhas)
   ===================================================================== */
const cvC = $('#confete'), ctxC = cvC.getContext('2d');
const CORES = ['#c23b22', '#b8862b', '#1b2036', '#f2e3b3', '#e7a493', '#4a5a8a'];
let pedacos = [], animandoConfete = false;
function ajustarConfete() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cvC.width = innerWidth * dpr; cvC.height = innerHeight * dpr;
  ctxC.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', ajustarConfete); ajustarConfete();

function novoPedaco(x, y, vx, vy, soLuas) {
  return {
    x, y, vx, vy,
    rot: Math.random() * 6.3, vr: (Math.random() - .5) * .3,
    tam: Math.random() * 7 + 6,
    cor: soLuas ? '#f2e3b3' : sorteio(CORES),
    lua: soLuas || Math.random() < .18,
    balanço: Math.random() * 6.3, vida: 1
  };
}
function confeteChuva(qtd = 120) {
  if (menosMovimento) qtd = 20;
  for (let i = 0; i < qtd; i++)
    pedacos.push(novoPedaco(Math.random() * innerWidth, -20 - Math.random() * innerHeight * .5, (Math.random() - .5) * 2, Math.random() * 2 + 2));
  rodarConfete();
}
function confeteDe(x, y, qtd = 60, soLuas = false) {
  if (menosMovimento) qtd = 12;
  for (let i = 0; i < qtd; i++) {
    const a = Math.random() * Math.PI * 2, v = Math.random() * 7 + 3;
    pedacos.push(novoPedaco(x, y, Math.cos(a) * v, Math.sin(a) * v - 4, soLuas));
  }
  rodarConfete();
}
function desenharPedaco(p) {
  ctxC.save();
  ctxC.translate(p.x, p.y); ctxC.rotate(p.rot);
  ctxC.globalAlpha = Math.max(0, p.vida);
  ctxC.fillStyle = p.cor;
  if (p.lua) {
    const r = p.tam * .7;
    ctxC.beginPath(); ctxC.arc(0, 0, r, 0, 6.3); ctxC.clip();
    ctxC.beginPath(); ctxC.rect(-r, -r, 2 * r, 2 * r); ctxC.arc(r * .45, -r * .15, r * .85, 0, 6.3, true);
    ctxC.fill('evenodd');
  } else {
    ctxC.scale(1, Math.cos(p.balanço));
    ctxC.fillRect(-p.tam / 2, -p.tam / 4, p.tam, p.tam / 2);
  }
  ctxC.restore();
}
function rodarConfete() {
  if (animandoConfete) return;
  animandoConfete = true;
  (function quadro() {
    ctxC.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of pedacos) {
      p.vy += .12; p.vx *= .985; p.vy *= .985;
      p.x += p.vx + Math.sin(p.balanço) * .6; p.y += p.vy;
      p.rot += p.vr; p.balanço += .12;
      if (p.y > innerHeight - 40) p.vida -= .03;
      desenharPedaco(p);
    }
    pedacos = pedacos.filter(p => p.vida > 0 && p.y < innerHeight + 40);
    if (pedacos.length) requestAnimationFrame(quadro);
    else { animandoConfete = false; ctxC.clearRect(0, 0, innerWidth, innerHeight); }
  })();
}

/* brilhinhos dourados ao clicar em área vazia */
document.addEventListener('click', e => {
  if (e.target.closest('button, a, .ficha, .vale, .constelacao')) return;
  for (let i = 0; i < 6; i++) {
    const b = el('span', 'brilho');
    const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 40;
    b.style.left = e.clientX + 'px'; b.style.top = e.clientY + 'px';
    b.style.setProperty('--dx', Math.cos(a) * d + 'px');
    b.style.setProperty('--dy', Math.sin(a) * d + 'px');
    if (i % 2) b.style.background = 'var(--vermelho)';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 950);
  }
});

/* segredo: digitar o nome dela no teclado */
let digitado = '';
document.addEventListener('keydown', e => {
  if (e.key.length !== 1) return;
  digitado = (digitado + e.key.toLowerCase()).slice(-C.nome.length);
  if (digitado === C.nome.toLowerCase()) confeteDe(innerWidth / 2, innerHeight / 2, 90, true);
});

/* =====================================================================
   ODÔMETRO (dígitos que rolam)
   ===================================================================== */
function criarOdometro(alvo, casas) {
  alvo.innerHTML = '';
  for (let i = 0; i < casas; i++) {
    const col = el('span', 'od-col'), fita = el('span', 'od-fita');
    for (let n = 0; n < 10; n++) fita.appendChild(el('span', null, n));
    col.appendChild(fita); alvo.appendChild(col);
  }
}
function definirOdometro(alvo, valor) {
  const fitas = alvo.querySelectorAll('.od-fita');
  const txt = String(valor).padStart(fitas.length, '0').slice(-fitas.length);
  fitas.forEach((f, i) => f.style.transform = `translateY(${-txt[i] * 1.2}em)`);
}

/* =====================================================================
   NUMERAÇÃO + ÍNDICE
   ===================================================================== */
if (!C.vales || !C.vales.length) $('#c-vales').hidden = true;

const indice = $('#indice');
document.querySelectorAll('.cap:not([hidden])').forEach((sec, i) => {
  const num = 'Nº ' + pad(i + 1);
  sec.querySelector('.cap-num').textContent = num;
  const li = el('li'), a = el('a');
  a.href = '#' + sec.id;
  a.append(el('span', 'n', pad(i + 1)), el('span', 't', sec.dataset.titulo), el('span', 'pontos'));
  li.appendChild(a); indice.appendChild(li);
});

/* =====================================================================
   A DEFINIÇÃO (piada interna)
   ===================================================================== */
(() => {
  const nome = C.nome;
  const meio = Math.ceil(nome.length / 2);
  $('#verbetePalavra').textContent = nome.slice(0, meio) + '·' + nome.slice(meio);
  $('#verbetePron').textContent = '/ˈ' + nome.toLowerCase() + '/';
  $('#vf1').textContent = C.piada.frase1;
  $('#vf2').textContent = C.piada.frase2;
  $('#carimbo').textContent = C.piada.final;

  const lista = $('#acepcoes');
  C.piada.adjetivos.forEach((a, i) => {
    const li = el('li');
    li.append(el('span', 'n', i + 1 + '.'), el('span', 'palavra', a.palavra));
    if (a.nota) li.appendChild(el('span', 'nota', a.nota));
    lista.appendChild(li);
  });

  const itens = [$('#vf1'), $('#vf2'), ...lista.children];
  const btn = $('#btnPiada');
  let passo = 0;
  const rotulo = t => { btn.firstChild.textContent = t + ' '; };

  btn.addEventListener('click', () => {
    if (passo > itens.length) {           // recomeçar
      itens.forEach(i => i.classList.remove('mostra'));
      $('#carimbo').classList.remove('bate');
      passo = 0; rotulo('ler o verbete'); return;
    }
    if (passo < itens.length) {
      itens[passo].classList.add('mostra');
      passo++;
      rotulo(passo === 1 ? 'mas...' : passo === itens.length ? 'e por fim' : 'continuar');
    } else {
      const c = $('#carimbo');
      c.classList.add('bate');
      setTimeout(() => {
        vibrar(40);
        const r = c.getBoundingClientRect();
        confeteDe(r.left + r.width / 2, r.top + r.height / 2, 80);
      }, 260);
      passo++;
      rotulo('ler de novo');
    }
  });
})();

/* =====================================================================
   COISAS QUE EU ADMIRO (baralho de fichas)
   ===================================================================== */
(() => {
  const baralho = $('#baralho');
  const total = C.admiro.length;
  const fichas = C.admiro.map((item, i) => {
    const f = el('article', 'ficha');
    f.append(el('span', 'mono', `ficha ${pad(i + 1)} de ${pad(total)}`), el('h3', null, item.titulo), el('p', null, item.texto));
    baralho.appendChild(f);
    return f;
  });
  const POS = [
    'rotate(-1.2deg)',
    'translate(8px, 9px) rotate(2.2deg)',
    'translate(-6px, 16px) rotate(-3.4deg)',
  ];
  let ordem = fichas.map((_, i) => i), ocupado = false, vistas = 1;

  function arrumar() {
    ordem.forEach((idx, prof) => {
      const f = fichas[idx];
      f.style.zIndex = total - prof;
      f.style.transform = POS[Math.min(prof, POS.length - 1)];
      f.style.opacity = prof < POS.length ? 1 : 0;
      f.tabIndex = prof === 0 ? 0 : -1;
    });
    $('#baralhoCont').textContent = vistas >= total ? 'você viu todas. pode ver de novo.' : `${vistas} de ${total} lidas`;
  }
  function proxima() {
    if (ocupado) return;
    ocupado = true;
    const topo = fichas[ordem[0]];
    topo.style.transform = `translate(${innerWidth < 600 ? 70 : 110}%, -20px) rotate(14deg)`;
    setTimeout(() => {
      ordem.push(ordem.shift());
      vistas = Math.min(total, vistas + 1);
      topo.style.transition = 'none';
      arrumar();
      void topo.offsetWidth;
      topo.style.transition = '';
      ocupado = false;
    }, 420);
  }
  fichas.forEach(f => {
    f.addEventListener('click', () => { if (f === fichas[ordem[0]]) proxima(); });
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); proxima(); } });
  });
  $('#btnProx').addEventListener('click', proxima);

  // a altura do baralho acompanha a ficha com mais texto (importante no celular)
  function medirAltura() {
    baralho.style.height = 'auto';
    let maior = 0;
    fichas.forEach(f => {
      f.style.position = 'relative'; f.style.height = 'auto';
      maior = Math.max(maior, f.offsetHeight);
      f.style.position = ''; f.style.height = '';
    });
    baralho.style.height = Math.max(240, maior) + 'px';
  }
  let larguraAntes = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== larguraAntes) { larguraAntes = innerWidth; medirAltura(); } });
  if (document.fonts) document.fonts.ready.then(medirAltura);
  medirAltura();
  arrumar();
})();

/* =====================================================================
   MÁQUINA DE ELOGIOS
   ===================================================================== */
(() => {
  const odo = $('#odoElogios'), saida = $('#maqSaida'), btn = $('#btnElogio');
  criarOdometro(odo, 4);
  let saco = [], emitidos = 0, ocupado = false, ultimoTexto = '';

  btn.addEventListener('click', () => {
    if (ocupado) return;
    ocupado = true;
    setTimeout(() => ocupado = false, 650);
    if (!saco.length) {
      saco = [...C.elogios].sort(() => Math.random() - .5);
      if (saco.length > 1 && saco[saco.length - 1] === ultimoTexto) saco.unshift(saco.pop());
    }
    const texto = saco.pop();
    ultimoTexto = texto;
    emitidos++;
    definirOdometro(odo, emitidos);

    const velho = saida.querySelector('.ticket:not(.cai)');
    if (velho) { velho.classList.add('cai'); setTimeout(() => velho.remove(), 650); }

    const agora = new Date();
    const t = el('div', 'ticket');
    const topo = el('div', 't-linha mono');
    topo.append(el('span', null, 'Elogio'), el('span', null, 'Nº ' + pad(emitidos, 4)));
    const pe = el('div', 't-linha mono t-pe');
    pe.append(
      el('span', null, `${pad(agora.getDate())}.${pad(agora.getMonth() + 1)}.${agora.getFullYear()} · ${pad(agora.getHours())}:${pad(agora.getMinutes())}`),
      el('span', null, 'válido pra sempre')
    );
    t.append(topo, el('p', 't-texto', texto), pe);
    saida.appendChild(t);
    saida.style.height = Math.max(250, t.offsetHeight + 30) + 'px';
    vibrar(15);

    if (emitidos % 10 === 0) {
      const r = btn.getBoundingClientRect();
      confeteDe(r.left + r.width / 2, r.top, 50);
    }
  });
})();

/* =====================================================================
   O MEDIDOR (segurar o botão)
   ===================================================================== */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const g = $('#gauge'), cx = 150, cy = 165, R = 120;
  const pt = (v, r) => { const a = Math.PI - v / 100 * Math.PI; return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
  const arco = (v0, v1, r) => { const [x0, y0] = pt(v0, r), [x1, y1] = pt(v1, r); return `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`; };
  const svg = (tag, attrs, texto) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (texto != null) n.textContent = texto;
    g.appendChild(n); return n;
  };

  svg('path', { d: arco(0, 100, R) + `L${cx + R} ${cy}L${cx - R} ${cy}Z`, fill: '#fbf6ec' });
  svg('path', { d: arco(85, 100, R - 6), stroke: '#c23b22', 'stroke-width': 10, fill: 'none', opacity: .85 });
  svg('path', { d: arco(0, 100, R), stroke: '#1b2036', 'stroke-width': 2, fill: 'none' });
  svg('line', { x1: cx - R - 8, y1: cy, x2: cx + R + 8, y2: cy, stroke: '#1b2036', 'stroke-width': 2 });
  for (let v = 0; v <= 100; v += 5) {
    const maior = v % 25 === 0;
    const [x0, y0] = pt(v, R), [x1, y1] = pt(v, maior ? R - 16 : R - 8);
    svg('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: '#1b2036', 'stroke-width': maior ? 2 : 1 });
    if (maior) { const [tx, ty] = pt(v, R - 28); svg('text', { x: tx, y: ty + 3, 'text-anchor': 'middle', class: 'numero' }, v); }
  }
  // as palavras seguem a curva do mostrador
  svg('path', { id: 'arcoMarcas', d: arco(0, 100, R + 10), fill: 'none' });
  C.medidor.marcas.forEach((m, i) => {
    const t = svg('text', { class: 'marca', 'text-anchor': 'middle' });
    const tp = document.createElementNS(NS, 'textPath');
    tp.setAttribute('href', '#arcoMarcas');
    tp.setAttribute('startOffset', (i + .5) * 100 / C.medidor.marcas.length + '%');
    tp.textContent = m;
    t.appendChild(tp);
  });
  const trincas = svg('g', {});
  ['M196 70l-14 22 9 10-18 26', 'M196 70l22 8 12 20', 'M196 70l-4-26', 'M191 102l-26 4'].forEach(d => {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'trinca'); trincas.appendChild(p);
  });
  const ponteiro = svg('g', {});
  const linha = document.createElementNS(NS, 'path');
  linha.setAttribute('d', `M${cx - 2.5} ${cy}L${cx} ${cy - R + 14}L${cx + 2.5} ${cy}Z`);
  linha.setAttribute('fill', '#c23b22');
  ponteiro.appendChild(linha);
  svg('circle', { cx, cy, r: 9, fill: '#1b2036' });
  svg('circle', { cx, cy, r: 3, fill: '#c23b22' });

  const odo = $('#odoMedidor'), msg = $('#medMsg'), btn = $('#btnSegurar'), caixa = $('#medidor');
  const leitura = odo.parentElement;
  criarOdometro(odo, 3); odo.classList.add('rapido');
  let v = 0, vel = 0, segurando = false, noMax = 0, quebrado = false, ultimo = -1;

  const mensagem = v =>
    v < 1 ? 'Segura o botão pra medir.' :
    v < 30 ? 'hmm, continua segurando...' :
    v < 60 ? 'subindo...' :
    v < 85 ? 'isso tá alto, hein' :
    v < 100 ? 'zona vermelha!' : 'o ponteiro tá forçando o limite...';

  function quadro() {
    if (!quebrado) {
      if (segurando) { vel = Math.min(vel + .03, 1.8); v += vel; }
      else { vel = 0; v = Math.max(0, v - .7); noMax = 0; }
      if (v >= 100) {
        v = 100;
        if (segurando) noMax++;
        caixa.classList.toggle('tremendo', segurando);
        if (noMax > 80) quebrar();
      } else caixa.classList.remove('tremendo');

      const jitter = v >= 100 && segurando ? (Math.random() - .3) * 3 : 0;
      ponteiro.setAttribute('transform', `rotate(${-90 + v * 1.8 + jitter} ${cx} ${cy})`);
      const r = Math.round(v);
      if (r !== ultimo) { definirOdometro(odo, r); msg.textContent = mensagem(v); ultimo = r; }
    }
    requestAnimationFrame(quadro);
  }
  function quebrar() {
    quebrado = true; segurando = false;
    btn.classList.remove('ativo');
    ponteiro.style.transition = 'transform .5s cubic-bezier(.3,2,.5,1)';
    ponteiro.setAttribute('transform', `rotate(98 ${cx} ${cy})`);
    g.classList.add('quebrado');
    setTimeout(() => caixa.classList.remove('tremendo'), 500);
    odo.hidden = true;
    leitura.prepend(el('span', 'infinito', '∞'));
    msg.textContent = C.medidor.quebrou;
    btn.textContent = 'consertar';
    vibrar([60, 40, 120]);
    const r = g.getBoundingClientRect();
    confeteDe(r.left + r.width * .65, r.top + r.height * .35, 90);
  }
  function consertar() {
    quebrado = false; v = 0; ultimo = -1;
    ponteiro.style.transition = '';
    g.classList.remove('quebrado');
    odo.hidden = false;
    leitura.querySelector('.infinito')?.remove();
    btn.textContent = 'segura aqui';
  }
  const comecar = e => {
    e.preventDefault();
    if (quebrado) { consertar(); return; }
    segurando = true; btn.classList.add('ativo');
    if (e.pointerId != null) try { btn.setPointerCapture(e.pointerId); } catch (_) {}
  };
  const parar = () => { segurando = false; btn.classList.remove('ativo'); };
  btn.addEventListener('pointerdown', comecar);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, parar));
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) comecar(e); });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') parar(); });
  btn.addEventListener('contextmenu', e => e.preventDefault());
  quadro();
})();

/* =====================================================================
   VALES
   ===================================================================== */
if (C.vales && C.vales.length) (() => {
  const CHAVE = 'almanaque-maria-vales';
  let salvos = {};
  try { salvos = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (_) {}
  const guardar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(salvos)); } catch (_) {} };
  const box = $('#vales');

  C.vales.forEach((texto, i) => {
    const v = el('div', 'vale');
    const corpo = el('div', 'vale-corpo');
    const btn = el('button', 'btn-texto');
    const carimbo = el('div', 'vale-carimbo');
    corpo.append(el('p', 'vale-texto', texto), btn);
    v.append(el('div', 'vale-canhoto mono', 'Vale Nº ' + pad(i + 1)), corpo, carimbo);

    const atualizar = () => {
      const data = salvos[texto];
      v.classList.toggle('resgatado', !!data);
      btn.textContent = data ? 'desfazer' : 'resgatar';
      carimbo.innerHTML = '';
      carimbo.append('Resgatado', el('small', null, data || ''));
    };
    btn.addEventListener('click', () => {
      if (salvos[texto]) delete salvos[texto];
      else {
        const d = new Date();
        salvos[texto] = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
        const r = v.getBoundingClientRect();
        confeteDe(r.right - 60, r.bottom - 30, 30);
      }
      guardar(); atualizar();
    });
    atualizar();
    box.appendChild(v);
  });
})();

/* =====================================================================
   CONSTELAÇÃO (liga os pontos, forma um coração)
   ===================================================================== */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = $('#constelacao'), msg = $('#constMsg');
  $('#constInstrucao').textContent = C.constelacao.instrucao;
  const mk = (tag, attrs, pai = svgEl) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    pai.appendChild(n); return n;
  };

  // céu de fundo
  for (let i = 0; i < 70; i++)
    mk('circle', { cx: Math.random() * 400, cy: Math.random() * 360, r: Math.random() * .9 + .2, class: 'fundo', opacity: Math.random() * .5 + .15 });

  const N = 12;
  const pontos = Array.from({ length: N }, (_, i) => {
    const t = Math.PI + i * 2 * Math.PI / N;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return [200 + x * 9 + (Math.random() - .5) * 8, 178 - y * 9 + (Math.random() - .5) * 8];
  });
  const linhas = mk('g', {});
  const grupos = pontos.map(([x, y], i) => {
    const gr = mk('g', {});
    mk('circle', { cx: x, cy: y, r: 4.5, class: 'estrela' }, gr);
    const rot = mk('text', { x: x + 9, y: y - 8, class: 'rotulo' }, gr); rot.textContent = i + 1;
    mk('circle', { cx: x, cy: y, r: 17, class: 'alvo' }, gr);
    gr.addEventListener('click', () => clicar(i));
    return gr;
  });

  let prox = 0;
  function linha(a, b) {
    const [x1, y1] = pontos[a], [x2, y2] = pontos[b];
    const l = mk('line', { x1, y1, x2, y2, class: 'linha' }, linhas);
    const comp = Math.hypot(x2 - x1, y2 - y1);
    l.style.strokeDasharray = comp + 'px';
    l.animate([{ strokeDashoffset: comp + 'px' }, { strokeDashoffset: '0px' }], { duration: 350, fill: 'forwards', easing: 'ease-out' });
    vibrar(8);
  }
  function marcar() {
    grupos.forEach((gr, i) => {
      gr.classList.toggle('prox', i === prox && prox < N);
      gr.classList.toggle('feita', i < prox);
    });
  }
  function clicar(i) {
    if (i !== prox || prox >= N) return;
    if (prox > 0) linha(prox - 1, prox);
    prox++;
    if (prox === N) {
      setTimeout(() => {
        linha(N - 1, 0);
        svgEl.classList.add('completa');
        msg.textContent = C.constelacao.mensagem;
        msg.classList.add('mostra');
        const r = svgEl.getBoundingClientRect();
        confeteDe(r.left + r.width / 2, r.top + r.height / 2, 70, true);
      }, 200);
    }
    marcar();
  }
  $('#constReset').addEventListener('click', () => {
    linhas.innerHTML = ''; prox = 0;
    svgEl.classList.remove('completa'); msg.classList.remove('mostra');
    marcar();
  });
  marcar();
})();

/* =====================================================================
   A CARTA
   ===================================================================== */
(() => {
  const carta = $('#carta'), box = $('#cartaConteudo');
  $('#cartaPara').textContent = 'Para: ' + C.nome;
  box.appendChild(el('p', 'abertura', C.carta.abertura));
  C.carta.paragrafos.forEach(p => box.appendChild(el('p', null, p)));
  box.appendChild(el('p', 'despedida', C.carta.despedida));
  if (C.assinatura) box.appendChild(el('p', 'assinatura', C.assinatura));

  $('#selo').addEventListener('click', () => {
    carta.classList.remove('fechada');
    [...box.children].forEach((p, i) => setTimeout(() => p.classList.add('mostra'), 700 + i * 450));
  });
})();

/* =====================================================================
   PERGUNTA FINAL
   ===================================================================== */
(() => {
  const sim = $('#btnSim'), nao = $('#btnNao');
  $('#finalPergunta').textContent = C.final.pergunta;
  sim.textContent = C.final.sim;
  nao.textContent = C.final.nao[0];
  let fugas = 0, escala = 1;

  // o "Não" foge só dentro da última página (antes ele ficava preso na tela ao rolar)
  const pagina = $('#c-final');
  let ultimaFuga = 0;
  const sobrepoe = (a, b, folga = 12) =>
    !(a.right + folga < b.left || a.left - folga > b.right || a.bottom + folga < b.top || a.top - folga > b.bottom);

  function fugir(e) {
    if (e) e.preventDefault();
    const agora = Date.now();
    if (agora - ultimaFuga < 300) return;      // um toque no celular gera vários eventos
    ultimaFuga = agora;

    const pr = pagina.getBoundingClientRect();
    if (!nao.classList.contains('fugindo')) {
      const r = nao.getBoundingClientRect();
      nao.style.left = r.left - pr.left + 'px'; nao.style.top = r.top - pr.top + 'px';
      nao.classList.add('fugindo');
      void nao.offsetWidth;
    }
    // primeiro troca o texto e cresce o "Sim", depois calcula onde cabe
    fugas++;
    nao.textContent = C.final.nao[fugas % C.final.nao.length];
    escala = Math.min(innerWidth < 500 ? 1.35 : 1.6, escala + .07);
    sim.style.transform = `scale(${escala})`;

    const w = nao.offsetWidth, h = nao.offsetHeight;
    // caixa do "Sim" já no tamanho final, em coordenadas da página
    const sw = sim.offsetWidth * escala, sh = sim.offsetHeight * escala;
    const scx = sim.offsetLeft + sim.offsetWidth / 2, scy = sim.offsetTop + sim.offsetHeight / 2;
    const simCaixa = { left: scx - sw / 2, right: scx + sw / 2, top: scy - sh / 2, bottom: scy + sh / 2 };
    // área permitida: a parte da página final que está visível na tela
    const topo = Math.max(0, -pr.top) + 16;
    const base = Math.min(pr.height, innerHeight - pr.top) - h - 16;
    const larg = pr.width - w - 32;

    let x, y, tentativa = 0;
    do {
      x = 16 + Math.random() * Math.max(0, larg);
      y = topo + Math.random() * Math.max(0, base - topo);
      tentativa++;
    } while (tentativa < 40 && sobrepoe({ left: x, top: y, right: x + w, bottom: y + h }, simCaixa));

    nao.style.left = x + 'px';
    nao.style.top = y + 'px';
    vibrar(10);
  }
  nao.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') fugir(); });
  nao.addEventListener('pointerdown', fugir);
  nao.addEventListener('click', fugir);

  sim.addEventListener('click', () => {
    $('#finalResposta').textContent = C.final.resposta;
    nao.hidden = true;
    sim.style.transform = '';
    confeteChuva(160);
  });
})();

})();
