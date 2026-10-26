/* PAINEL — lista de veículos: resumo (totais), busca, filtro por tipo, editar e excluir. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var P = AG.painel, U = AG.util;
  var el = U.el;

  var filter = 'all', term = '';
  var els = {};

  function updateStats() {
    var vehicles = AG.store.all();
    function count(type) { return vehicles.filter(function (v) { return v.type === type; }).length; }
    var sum = vehicles.reduce(function (a, v) { return a + (Number(v.price) || 0); }, 0);
    els.statTotal.textContent = vehicles.length;
    els.statCars.textContent = count('carro');
    els.statBikes.textContent = count('moto');
    els.statOthers.textContent = count('outro');
    els.statSum.textContent = U.currency.format(sum);
  }

  function deleteVehicle(id) {
    if (!P.state.logged) return;
    AG.store.set(AG.store.all().filter(function (x) { return x.id !== id; }));
    P.render();
    P.afterSave('Veículo excluído.');
  }

  function buildCard(v) {
    var card = el('article', 'card');
    var img = el('img', 'card-img');
    U.attachImage(img, v);
    card.appendChild(img);

    var body = el('div', 'card-body');
    var top = el('div', 'card-top');
    top.appendChild(el('h3', 'card-title', U.displayName(v)));
    top.appendChild(el('span', 'badge badge-' + v.type, U.typeLabel(v.type)));
    body.appendChild(top);
    body.appendChild(el('p', 'card-meta', v.brand + ' ' + v.model + ' · Ano: ' + v.year));
    body.appendChild(el('p', 'card-desc', U.textOrNotInformed(v.description)));

    var r1 = el('div', 'price-row');
    r1.appendChild(el('span', 'lbl', 'Preço anunciado'));
    r1.appendChild(el('span', 'price-main', U.formatMoney(v.price)));
    body.appendChild(r1);
    var r2 = el('div', 'price-row');
    r2.appendChild(el('span', 'lbl', 'Valor aprox. de mercado'));
    r2.appendChild(el('span', 'price-ref', U.formatMoney(v.market)));
    body.appendChild(r2);
    card.appendChild(body);

    var actions = el('div', 'card-actions');
    var bView = el('button', 'btn btn-view', 'Detalhes');
    var bEdit = el('button', 'btn btn-edit', 'Editar');
    var bDel = el('button', 'btn btn-danger', 'Excluir');
    bView.type = bEdit.type = bDel.type = 'button';
    bView.addEventListener('click', function () { P.showScreen('detail', v.id); });
    bEdit.addEventListener('click', function () { P.formulario.open(v.id); });
    bDel.addEventListener('click', function () {
      actions.innerHTML = '';
      actions.appendChild(el('span', 'confirm-text', 'Excluir este veículo?'));
      var yes = el('button', 'btn btn-danger', 'Sim, excluir');
      var no = el('button', 'btn btn-ghost', 'Não');
      yes.type = no.type = 'button';
      yes.addEventListener('click', function () { deleteVehicle(v.id); });
      no.addEventListener('click', function () { render(); });
      actions.appendChild(yes);
      actions.appendChild(no);
    });
    actions.appendChild(bView);
    actions.appendChild(bEdit);
    actions.appendChild(bDel);
    card.appendChild(actions);
    return card;
  }

  function render() {
    updateStats();
    var vehicles = AG.store.all();
    var visible = vehicles.filter(function (v) { return U.matches(v, filter, term); });
    els.list.innerHTML = '';
    visible.forEach(function (v) { els.list.appendChild(buildCard(v)); });
    if (visible.length === 0) {
      els.empty.hidden = false;
      els.emptyText.textContent = vehicles.length === 0
        ? 'Clique em “Cadastrar veículo” para adicionar o primeiro.'
        : 'Nenhum veículo corresponde à pesquisa ou ao filtro selecionado.';
    } else {
      els.empty.hidden = true;
    }
  }

  function setup() {
    var $ = P.$;
    els = {
      list: $('vehicle-list'), empty: $('empty-state'), emptyText: $('empty-text'), search: $('search'),
      statTotal: $('stat-total'), statCars: $('stat-cars'), statBikes: $('stat-bikes'),
      statOthers: $('stat-others'), statSum: $('stat-sum')
    };
    els.search.addEventListener('input', function () { term = els.search.value; render(); });
    var chips = document.querySelectorAll('[data-filter]');
    Array.prototype.forEach.call(chips, function (btn) {
      btn.addEventListener('click', function () {
        filter = btn.getAttribute('data-filter');
        Array.prototype.forEach.call(chips, function (b) { b.classList.toggle('is-active', b === btn); });
        render();
      });
    });
    $('btn-new').addEventListener('click', function () { P.formulario.open(null); });
  }

  P.lista = { render: render, setup: setup };
})();
