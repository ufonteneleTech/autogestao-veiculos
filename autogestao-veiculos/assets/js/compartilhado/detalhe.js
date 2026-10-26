/* Tela de detalhes do anúncio. Usada pela vitrine e pelo painel.
   AG.detalhe.render(container, veiculo, { backText, onBack, onEdit })
   - onEdit é opcional: se informado, mostra o botão "Editar este veículo" (só no painel). */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var C = AG.config, U = AG.util;
  var el = U.el;

  function openExternal(a, href) {
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  function render(body, v, opts) {
    opts = opts || {};
    body.innerHTML = '';

    var back = el('button', 'back-link', opts.backText || '← Voltar');
    back.type = 'button';
    back.addEventListener('click', function () { if (opts.onBack) opts.onBack(); });
    body.appendChild(back);

    if (!v) { body.appendChild(el('p', 'notice', 'Veículo não encontrado. Ele pode ter sido excluído.')); return; }

    var layout = el('div', 'detail-layout');

    var gallery = el('div', 'gallery');
    var fallback = U.placeholderImage(v.type);
    var imgs = U.getImages(v).filter(U.isImageSrc);
    var main = el('img', 'gallery-main');
    main.alt = U.displayName(v);
    main.src = imgs[0] || fallback;
    main.addEventListener('error', function () { if (main.src !== fallback) main.src = fallback; });
    gallery.appendChild(main);
    if (imgs.length > 1) {
      var thumbs = el('div', 'thumbs');
      imgs.forEach(function (src, i) {
        var t = el('img', 'thumb' + (i === 0 ? ' is-active' : ''));
        t.src = src;
        t.alt = 'Foto ' + (i + 1);
        t.addEventListener('click', function () {
          main.src = src;
          Array.prototype.forEach.call(thumbs.children, function (c) { c.classList.toggle('is-active', c === t); });
        });
        thumbs.appendChild(t);
      });
      gallery.appendChild(thumbs);
    }
    layout.appendChild(gallery);

    var info = el('div', 'info-panel');
    info.appendChild(el('span', 'badge badge-' + v.type, U.typeLabel(v.type)));
    info.appendChild(el('h2', '', U.displayName(v)));
    info.appendChild(el('p', 'card-meta', v.brand + ' ' + v.model + ' · ' + v.year));
    info.appendChild(el('p', 'info-price', U.formatMoney(v.price)));
    info.appendChild(el('p', 'info-market', 'Valor aproximado de mercado: ' + U.formatMoney(v.market) + ' (estimativa)'));

    var dl = el('dl', 'detail-list');
    [['Marca', v.brand], ['Modelo', v.model], ['Ano', String(v.year)],
     ['Cor', U.textOrNotInformed(v.color)], ['Quilometragem', U.formatKm(v.km)], ['Tipo', U.typeLabel(v.type)]
    ].forEach(function (r) {
      var box = el('div');
      box.appendChild(el('dt', '', r[0]));
      box.appendChild(el('dd', '', r[1]));
      dl.appendChild(box);
    });
    info.appendChild(dl);

    info.appendChild(el('h3', '', 'Descrição'));
    info.appendChild(el('p', 'detail-desc', U.textOrNotInformed(v.description)));

    var note = el('div', 'detail-note');
    note.appendChild(document.createTextNode(
      'O preço anunciado é definido pelo vendedor. O valor de mercado é uma estimativa de referência, não uma cotação oficial garantida. ' +
      'Origem informada: ' + U.textOrNotInformed(v.refNote) + '. '
    ));
    if (v.refUrl && U.isSafeUrl(v.refUrl)) {
      var a = el('a', '', v.refUrl);
      openExternal(a, v.refUrl);
      note.appendChild(a);
    }
    info.appendChild(note);

    if (opts.onEdit) {
      var actions = el('div', 'modal-actions');
      var edit = el('button', 'btn btn-edit', 'Editar este veículo');
      edit.type = 'button';
      edit.addEventListener('click', function () { opts.onEdit(v.id); });
      actions.appendChild(edit);
      info.appendChild(actions);
    }

    var contact = el('div', 'contact-bar');
    var adNum = U.adNumber(v);
    var custom = adNum !== C.PHONE_WA;
    contact.appendChild(el('span', '', 'Dúvidas ou quer comprar? Contato: ' +
      (custom ? U.formatPhone(adNum) : C.PHONE_DISPLAY + ' ou ' + C.PHONE2_DISPLAY)));
    var btns = el('div', 'contact-actions');
    var wa = el('a', 'btn btn-whatsapp', '💬 WhatsApp ' + (custom ? U.formatPhone(adNum) : C.PHONE_DISPLAY));
    openExternal(wa, U.whatsappLink(v));
    btns.appendChild(wa);
    if (!custom) {
      var wa2 = el('a', 'btn btn-whatsapp', '💬 WhatsApp ' + C.PHONE2_DISPLAY);
      openExternal(wa2, C.PHONE2_LINK);
      btns.appendChild(wa2);
    }
    contact.appendChild(btns);
    info.appendChild(contact);

    layout.appendChild(info);
    body.appendChild(layout);
  }

  AG.detalhe = { render: render };
})();
