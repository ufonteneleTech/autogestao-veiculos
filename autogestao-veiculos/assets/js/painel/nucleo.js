/* PAINEL — núcleo: estado, telas, navegação, mensagens e tela de detalhes.
   Os demais arquivos do painel (acesso, lista, formulário, dados, prévia) se registram em AG.painel. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var U = AG.util;
  var el = U.el;
  var $ = function (id) { return document.getElementById(id); };

  var P = AG.painel = {};
  P.$ = $;
  P.state = { logged: false, detailBack: 'list' };

  P.screens = {};
  ['login', 'list', 'form', 'showcase', 'detail'].forEach(function (n) { P.screens[n] = $('screen-' + n); });
  P.els = { nav: $('nav'), messages: $('messages'), detailBody: $('detail-body') };

  /* ---------- Mensagens ---------- */
  var messageTimer = null;
  P.showMessage = function (text, kind) {
    P.els.messages.innerHTML = '';
    P.els.messages.appendChild(el('div', 'alert alert-' + (kind === 'error' ? 'error' : 'success'), text));
    clearTimeout(messageTimer);
    messageTimer = setTimeout(function () { P.els.messages.innerHTML = ''; }, 7000);
  };
  P.clearMessages = function () { P.els.messages.innerHTML = ''; };

  P.afterSave = function (text) {
    if (AG.store.save()) P.showMessage(text, 'success');
    else P.showMessage(text + ' Atenção: o navegador não permitiu gravar os dados; eles somem ao recarregar a página.', 'error');
  };

  /* Atualiza a lista do painel e a prévia da vitrine. */
  P.render = function () {
    P.lista.render();
    P.previa.render();
  };

  /* ---------- Navegação e controle de acesso ---------- */
  var ALLOWED = {
    logged: ['list', 'form', 'showcase', 'detail'],
    anon: ['login']
  };

  function canOpen(name) {
    return ALLOWED[P.state.logged ? 'logged' : 'anon'].indexOf(name) !== -1;
  }

  P.buildNav = function () {
    var nav = P.els.nav;
    nav.innerHTML = '';
    if (!P.state.logged) { nav.hidden = true; return; }
    nav.hidden = false;
    [['list', '🚗 Veículos'], ['form', '➕ Cadastrar'], ['showcase', '🖼️ Prévia da vitrine']].forEach(function (it) {
      var b = el('button', 'nav-link', it[1]);
      b.type = 'button';
      b.setAttribute('data-tab', it[0]);
      b.addEventListener('click', function () {
        P.clearMessages();
        if (it[0] === 'form') P.formulario.open(null); else P.showScreen(it[0]);
      });
      nav.appendChild(b);
    });
    var out = el('button', 'nav-link', '🚪 Sair');
    out.type = 'button';
    out.addEventListener('click', function () { P.acesso.logout(); });
    nav.appendChild(out);
  };

  function currentScreenName() {
    var found = 'login';
    Object.keys(P.screens).forEach(function (k) { if (!P.screens[k].hidden) found = k; });
    return found;
  }

  P.showScreen = function (name, id) {
    if (!canOpen(name)) name = P.state.logged ? 'list' : 'login';
    if (name === 'detail') {
      var from = P.screens.detail.hidden ? currentScreenName() : P.state.detailBack;
      P.state.detailBack = (from === 'form' || from === 'detail') ? 'list' : from;
    }
    Object.keys(P.screens).forEach(function (k) { P.screens[k].hidden = k !== name; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (b) {
      var active = name === 'detail' ? P.state.detailBack : name;
      b.classList.toggle('is-active', b.getAttribute('data-tab') === active);
    });
    if (name === 'detail') renderDetail(id);
    window.scrollTo(0, 0);
  };

  /* ---------- Detalhes do anúncio (com botão de editar) ---------- */
  function renderDetail(id) {
    var v = AG.store.all().find(function (x) { return x.id === id; });
    var backTarget = P.state.detailBack === 'showcase' ? 'showcase' : 'list';
    AG.detalhe.render(P.els.detailBody, v, {
      backText: backTarget === 'showcase' ? '← Voltar para a vitrine' : '← Voltar para a lista',
      onBack: function () { P.showScreen(backTarget); },
      onEdit: function (vid) { P.formulario.open(vid); }
    });
  }
})();
