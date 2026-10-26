/* PAINEL — acesso: login e sessão.
   O e-mail e a senha NÃO ficam no código publicado: ficam em painel/acesso.local.js
   (arquivo ignorado pelo Git). Veja o README. Atenção: é só uma trava de tela no navegador,
   não uma proteção de servidor. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var P = AG.painel;
  var SESSION_KEY = 'autogestao_sessao_v1';
  var memory = {};

  function readSession() {
    try { return sessionStorage.getItem(SESSION_KEY); } catch (e) { return memory[SESSION_KEY] || null; }
  }
  function writeSession(value) {
    memory[SESSION_KEY] = value;
    try {
      if (value) sessionStorage.setItem(SESSION_KEY, value); else sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function credentials() {
    var a = window.AUTOGESTAO_ACESSO;
    return a && a.email && a.senha ? a : null;
  }

  var els = {};

  function showLoginError(text) {
    els.error.hidden = false;
    els.error.textContent = text;
  }

  function handleLogin(event) {
    event.preventDefault();
    var cred = credentials();
    if (!cred) {
      showLoginError('Acesso não configurado. Crie o arquivo painel/acesso.local.js (veja o README).');
      return;
    }
    var email = els.email.value.trim().toLowerCase();
    var pass = els.pass.value;
    if (email === String(cred.email).trim().toLowerCase() && pass === cred.senha) {
      P.state.logged = true;
      writeSession('admin');
      els.form.reset();
      els.error.hidden = true;
      P.dados.seedIfNeeded();
      P.buildNav();
      P.render();
      P.showScreen('list');
    } else {
      showLoginError('E-mail ou senha incorretos.');
      els.pass.value = '';
    }
  }

  P.acesso = {
    restore: function () { P.state.logged = readSession() === 'admin'; },
    setup: function () {
      els.form = P.$('login-form');
      els.error = P.$('login-error');
      els.email = P.$('l-email');
      els.pass = P.$('l-pass');
      els.form.addEventListener('submit', handleLogin);
      P.$('login-back').addEventListener('click', function () { window.location.href = '../index.html'; });
      if (!credentials()) {
        showLoginError('Acesso não configurado. Crie o arquivo painel/acesso.local.js (veja o README).');
      }
    },
    logout: function () {
      P.state.logged = false;
      writeSession(null);
      window.location.href = '../index.html';
    }
  };
})();
