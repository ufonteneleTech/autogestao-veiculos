/* PAINEL — "Prévia da vitrine": mostra no painel exatamente a vitrine pública. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var P = AG.painel;
  var showcase = null;

  P.previa = {
    mount: function () {
      var $ = P.$;
      showcase = AG.vitrine.mount({
        list: $('showcase-list'),
        empty: $('showcase-empty'),
        emptyTitle: $('showcase-empty-title'),
        emptyText: $('showcase-empty-text'),
        search: $('vsearch'),
        onOpen: function (id) { P.showScreen('detail', id); }
      });
    },
    render: function () { if (showcase) showcase.render(); }
  };
})();
