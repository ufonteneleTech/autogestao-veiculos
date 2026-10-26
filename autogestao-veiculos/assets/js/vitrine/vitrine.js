/* VITRINE: lista pública de veículos (cards, busca e filtro por tipo).
   AG.vitrine.mount({ list, empty, emptyTitle, emptyText, search, onOpen }) devolve { render }.
   É usada pela página vitrine/ e também pela "Prévia da vitrine" do painel. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var C = AG.config, U = AG.util;
  var el = U.el;

  function buildCard(v, onOpen) {
    var card = el('article', 'card');
    var img = el('img', 'card-img');
    U.attachImage(img, v);
    card.appendChild(img);

    var body = el('div', 'card-body');
    var top = el('div', 'card-top');
    top.appendChild(el('h3', 'card-title', U.displayName(v)));
    top.appendChild(el('span', 'badge badge-' + v.type, U.typeLabel(v.type)));
    body.appendChild(top);
    body.appendChild(el('p', 'card-meta', v.brand + ' ' + v.model + ' · ' + v.year));
    body.appendChild(el('p', 'card-desc', U.textOrNotInformed(v.description)));
    body.appendChild(el('span', 'price-main', U.formatMoney(v.price)));
    card.appendChild(body);

    var actions = el('div', 'card-actions');
    var more = el('button', 'btn btn-view', 'Ver detalhes');
    more.type = 'button';
    more.addEventListener('click', function () { onOpen(v.id); });
    var buy = el('a', 'btn btn-whatsapp', 'Tenho interesse');
    buy.href = U.whatsappLink(v);
    buy.target = '_blank';
    buy.rel = 'noopener noreferrer';
    actions.appendChild(more);
    actions.appendChild(buy);
    card.appendChild(actions);
    return card;
  }

  function mount(o) {
    var filter = 'all', term = '';

    function render() {
      var vehicles = AG.store.all();
      var visible = vehicles.filter(function (v) { return U.matches(v, filter, term); });
      o.list.innerHTML = '';
      visible.forEach(function (v) { o.list.appendChild(buildCard(v, o.onOpen)); });
      if (visible.length === 0) {
        o.empty.hidden = false;
        if (vehicles.length === 0) {
          o.emptyTitle.textContent = 'Nenhum veículo disponível no momento.';
          o.emptyText.textContent = 'Entre em contato pelo WhatsApp ' + C.PHONE_DISPLAY + ' ou ' + C.PHONE2_DISPLAY + ' para saber das novidades.';
        } else {
          o.emptyTitle.textContent = 'Nenhum veículo encontrado.';
          o.emptyText.textContent = 'Tente outra pesquisa ou outro filtro.';
        }
      } else {
        o.empty.hidden = true;
      }
    }

    o.search.addEventListener('input', function () { term = o.search.value; render(); });

    var chips = document.querySelectorAll('[data-vfilter]');
    Array.prototype.forEach.call(chips, function (btn) {
      btn.addEventListener('click', function () {
        filter = btn.getAttribute('data-vfilter');
        Array.prototype.forEach.call(chips, function (b) { b.classList.toggle('is-active', b === btn); });
        render();
      });
    });

    return { render: render };
  }

  AG.vitrine = { buildCard: buildCard, mount: mount };
})();
