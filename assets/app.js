/* Caderno de Campo, 1933 — comportamento do site. */
(function () {
  // Fichário: só uma etiqueta aberta por vez (reforço para navegadores sem <details name>).
  document.querySelectorAll('.gaveta').forEach(function (g) {
    var itens = g.querySelectorAll('details.etiqueta');
    itens.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  });

  // Galeria em tela cheia.
  var botoes = Array.prototype.slice.call(document.querySelectorAll('.galeria button'));
  if (!botoes.length) return;
  var fontes = botoes.map(function (b) { return { src: b.getAttribute('data-grande'), alt: b.getAttribute('aria-label') || '' }; });
  var atual = 0, lupa = null, img = null, cont = null, toqueX = null;

  function mostrar(i) {
    atual = (i + fontes.length) % fontes.length;
    img.src = fontes[atual].src; img.alt = fontes[atual].alt;
    cont.textContent = (atual + 1) + ' / ' + fontes.length;
    lupa.querySelector('.ant').hidden = lupa.querySelector('.prox').hidden = fontes.length < 2;
  }
  function fechar() { if (lupa) { lupa.remove(); lupa = null; document.removeEventListener('keydown', teclas); } }
  function teclas(e) {
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowRight') mostrar(atual + 1);
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
  }
  function abrir(i) {
    lupa = document.createElement('div');
    lupa.className = 'lupa'; lupa.setAttribute('role', 'dialog'); lupa.setAttribute('aria-modal', 'true');
    lupa.innerHTML = '<img alt=""><button class="x" type="button">Fechar ✕</button>' +
      '<button class="ant" type="button">← Anterior</button><button class="prox" type="button">Próxima →</button><span class="cont"></span>';
    img = lupa.querySelector('img'); cont = lupa.querySelector('.cont');
    lupa.querySelector('.x').onclick = fechar;
    lupa.querySelector('.ant').onclick = function () { mostrar(atual - 1); };
    lupa.querySelector('.prox').onclick = function () { mostrar(atual + 1); };
    lupa.addEventListener('click', function (e) { if (e.target === lupa) fechar(); });
    lupa.addEventListener('touchstart', function (e) { toqueX = e.touches[0].clientX; }, { passive: true });
    lupa.addEventListener('touchend', function (e) {
      if (toqueX === null) return;
      var dx = e.changedTouches[0].clientX - toqueX; toqueX = null;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    });
    document.body.appendChild(lupa);
    document.addEventListener('keydown', teclas);
    mostrar(i);
    lupa.querySelector('.x').focus();
  }
  botoes.forEach(function (b, i) { b.addEventListener('click', function () { abrir(i); }); });
})();
