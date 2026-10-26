/* PAINEL — inicialização (carregado por último). */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var P = AG.painel;

  AG.store.init();
  P.acesso.restore();
  if (P.state.logged) P.dados.seedIfNeeded();

  P.acesso.setup();
  P.lista.setup();
  P.formulario.setup();
  P.dados.setup();
  P.previa.mount();

  P.buildNav();
  P.render();
  P.showScreen(P.state.logged ? 'list' : 'login');
})();
