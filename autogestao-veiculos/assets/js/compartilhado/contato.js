/* Preenche as barras de contato e o rodapé a partir de config.js, para os telefones
   ficarem em um único lugar.
   <div class="contact-bar" data-contato="barra" data-texto="..." data-botoes="curto|longo"></div>
   <p data-contato="rodape"></p> */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var C = AG.config, el = AG.util.el;

  function link(text, href) {
    var a = el('a', 'btn btn-whatsapp', text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-contato="barra"]'), function (bar) {
    var longo = bar.getAttribute('data-botoes') !== 'curto';
    var span = el('span', '', (bar.getAttribute('data-texto') || '') + ' ');
    span.appendChild(el('strong', '', C.PHONE_DISPLAY));
    span.appendChild(document.createTextNode(' ou '));
    span.appendChild(el('strong', '', C.PHONE2_DISPLAY));
    var actions = el('div', 'contact-actions');
    actions.appendChild(link('💬 ' + (longo ? 'WhatsApp ' : '') + C.PHONE_DISPLAY, 'https://wa.me/' + C.PHONE_WA));
    actions.appendChild(link('💬 ' + (longo ? 'WhatsApp ' : '') + C.PHONE2_DISPLAY, C.PHONE2_LINK));
    bar.innerHTML = '';
    bar.appendChild(span);
    bar.appendChild(actions);
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-contato="rodape"]'), function (p) {
    p.textContent = 'Contato: ' + C.PHONE_DISPLAY + ' / ' + C.PHONE2_DISPLAY + '. ' +
      'O preço anunciado é definido pelo vendedor; valores de mercado são apenas estimativas, não cotações oficiais. ' +
      'Confirme quilometragem, conservação e documentação antes de comprar.';
  });
})();
