/* VITRINE (página pública): inicia a lista e a tela de detalhes. Sem login, sem edição. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var $ = function (id) { return document.getElementById(id); };

  var listScreen = $('screen-showcase');
  var detailScreen = $('screen-detail');

  function showList() {
    detailScreen.hidden = true;
    listScreen.hidden = false;
    window.scrollTo(0, 0);
  }

  function openDetail(id) {
    var v = AG.store.all().find(function (x) { return x.id === id; });
    AG.detalhe.render($('detail-body'), v, { backText: '← Voltar para os veículos', onBack: showList });
    listScreen.hidden = true;
    detailScreen.hidden = false;
    window.scrollTo(0, 0);
  }

  AG.store.init();
  var showcase = AG.vitrine.mount({
    list: $('showcase-list'),
    empty: $('showcase-empty'),
    emptyTitle: $('showcase-empty-title'),
    emptyText: $('showcase-empty-text'),
    search: $('vsearch'),
    onOpen: openDetail
  });
  showcase.render();
})();
