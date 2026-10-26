/* Funções utilitárias: formatação, criação de elementos, imagens, telefone e filtro. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var C = AG.config;

  var currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var numberFmt = new Intl.NumberFormat('pt-BR');

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function normalize(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /* ---------- Veículo ---------- */
  function newId() { return 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }
  function typeLabel(t) { return t === 'moto' ? 'Moto' : (t === 'outro' ? 'Outros' : 'Carro'); }
  function displayName(v) { return v.name && String(v.name).trim() ? String(v.name).trim() : v.brand + ' ' + v.model; }

  /* ---------- Formatação ---------- */
  function formatMoney(n) { return (typeof n === 'number' && isFinite(n)) ? currency.format(n) : C.NOT_INFORMED; }
  function formatKm(n) { return (typeof n === 'number' && isFinite(n)) ? numberFmt.format(n) + ' km' : C.NOT_INFORMED; }
  function textOrNotInformed(v) { return v && String(v).trim() ? String(v).trim() : C.NOT_INFORMED; }

  /* ---------- Imagens ---------- */
  function placeholderImage(type) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">' +
      '<rect width="640" height="400" fill="#e6ecf5"/>' +
      '<text x="320" y="190" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#13315c" text-anchor="middle">' + typeLabel(type) + '</text>' +
      '<text x="320" y="240" font-family="Arial, sans-serif" font-size="24" fill="#5d6b7a" text-anchor="middle">Sem foto</text></svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }
  function isSafeUrl(value) {
    try { var u = new URL(value); return u.protocol === 'http:' || u.protocol === 'https:'; } catch (e) { return false; }
  }
  function isImageSrc(value) {
    return typeof value === 'string' && (isSafeUrl(value) || /^data:image\/(png|jpeg|webp|gif);base64,/.test(value));
  }
  function getImages(v) {
    if (Array.isArray(v.images) && v.images.length) return v.images;
    return v.image ? [v.image] : [];
  }
  function attachImage(img, v) {
    var fallback = placeholderImage(v.type);
    img.src = getImages(v).filter(isImageSrc)[0] || fallback;
    img.alt = displayName(v);
    img.loading = 'lazy';
    img.addEventListener('error', function () { if (img.src !== fallback) img.src = fallback; });
  }

  /* ---------- Telefone / WhatsApp ----------
     Número do anúncio: campo "WhatsApp do anúncio"; se vazio, procura um telefone
     escrito na descrição; se não achar, usa o contato padrão. */
  function toWaNumber(raw) {
    var d = String(raw || '').replace(/\D/g, '');
    if (d.indexOf('55') === 0 && (d.length === 12 || d.length === 13)) return d;
    if (d.length === 10 || d.length === 11) return '55' + d;
    return '';
  }
  function findPhoneInText(text) {
    var m = String(text || '').match(/(?:\+?55[\s-]?)?\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}/);
    return m ? toWaNumber(m[0]) : '';
  }
  function adNumber(v) {
    return toWaNumber(v.contact) || findPhoneInText(v.description) || C.PHONE_WA;
  }
  function formatPhone(wa) {
    var d = wa.replace(/^55/, '');
    if (d.length === 11) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    if (d.length === 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return wa;
  }
  function whatsappLink(v) {
    var text = 'Olá! Tenho interesse no veículo "' + displayName(v) + '" (' + v.year + '), anunciado por ' +
      formatMoney(v.price) + '. Ainda está disponível?';
    return 'https://wa.me/' + adNumber(v) + '?text=' + encodeURIComponent(text);
  }

  /* ---------- Pesquisa e filtro por tipo ---------- */
  function matches(v, filter, term) {
    if (filter !== 'all' && v.type !== filter) return false;
    var t = normalize(term.trim());
    return !t || normalize(displayName(v) + ' ' + v.brand + ' ' + v.model).indexOf(t) !== -1;
  }

  AG.util = {
    currency: currency,
    el: el, normalize: normalize,
    newId: newId, typeLabel: typeLabel, displayName: displayName,
    formatMoney: formatMoney, formatKm: formatKm, textOrNotInformed: textOrNotInformed,
    placeholderImage: placeholderImage, isSafeUrl: isSafeUrl, isImageSrc: isImageSrc,
    getImages: getImages, attachImage: attachImage,
    toWaNumber: toWaNumber, findPhoneInText: findPhoneInText, adNumber: adNumber,
    formatPhone: formatPhone, whatsappLink: whatsappLink,
    matches: matches
  };
})();
