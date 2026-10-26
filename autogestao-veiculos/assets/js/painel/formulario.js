/* PAINEL — formulário de cadastro/edição, validação e fotos. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var P = AG.painel, U = AG.util, C = AG.config;
  var el = U.el;

  var editingId = null;
  var formImages = [];
  var els = {};

  function clearErrors() {
    els.formError.hidden = true;
    els.formError.textContent = '';
    Array.prototype.forEach.call(els.form.elements, function (f) { f.classList.remove('invalid'); });
  }

  function open(id) {
    if (!P.state.logged) return;
    clearErrors();
    els.form.reset();
    editingId = id || null;
    var f = els.form.elements;
    if (editingId) {
      var v = AG.store.all().find(function (x) { return x.id === editingId; });
      if (!v) { editingId = null; return; }
      els.formTitle.textContent = 'Editar veículo';
      f.type.value = v.type;
      f.name.value = v.name || '';
      f.brand.value = v.brand;
      f.model.value = v.model;
      f.year.value = v.year;
      f.color.value = v.color || '';
      f.km.value = (typeof v.km === 'number') ? v.km : '';
      f.price.value = v.price;
      f.market.value = (typeof v.market === 'number') ? v.market : '';
      f.refNote.value = v.refNote || '';
      f.refUrl.value = v.refUrl || '';
      f.contact.value = v.contact || '';
      f.image.value = '';
      f.description.value = v.description || '';
      formImages = U.getImages(v).slice();
    } else {
      els.formTitle.textContent = 'Cadastrar veículo';
      f.type.value = 'carro';
      formImages = [];
    }
    renderPreviews();
    P.showScreen('form');
    try { f.brand.focus(); } catch (e) {}
  }

  function close() {
    editingId = null;
    formImages = [];
    els.form.reset();
    clearErrors();
    renderPreviews();
    P.showScreen('list');
  }

  function parseMoney(raw) {
    var s = String(raw).trim().replace(',', '.');
    if (s === '') return { empty: true };
    if (!/^\d+(\.\d{1,2})?$/.test(s)) return { invalid: true };
    var n = Number(s);
    return isFinite(n) && n >= 0 ? { value: n } : { invalid: true };
  }

  function validate() {
    var f = els.form.elements;
    var errors = [];
    var data = {};
    function fail(field, msg) { errors.push(msg); field.classList.add('invalid'); }

    data.type = (f.type.value === 'moto' || f.type.value === 'outro') ? f.type.value : 'carro';
    data.name = f.name.value.trim();

    data.brand = f.brand.value.trim();
    if (!data.brand) fail(f.brand, 'Informe a marca.');
    data.model = f.model.value.trim();
    if (!data.model) fail(f.model, 'Informe o modelo.');

    var maxYear = new Date().getFullYear() + 1;
    var yearRaw = f.year.value.trim();
    var year = Number(yearRaw);
    if (!yearRaw || !Number.isInteger(year) || year < 1900 || year > maxYear) {
      fail(f.year, 'Informe um ano válido entre 1900 e ' + maxYear + '.');
    } else { data.year = year; }

    data.color = f.color.value.trim();

    var kmRaw = f.km.value.trim();
    if (kmRaw === '') { data.km = null; }
    else {
      var km = Number(kmRaw);
      if (!Number.isInteger(km) || km < 0) fail(f.km, 'A quilometragem deve ser um número inteiro maior ou igual a zero.');
      else data.km = km;
    }

    var price = parseMoney(f.price.value);
    if (price.empty) fail(f.price, 'Informe o preço de venda anunciado.');
    else if (price.invalid) fail(f.price, 'O preço anunciado deve ser um valor válido, sem números negativos.');
    else data.price = price.value;

    var market = parseMoney(f.market.value);
    if (market.empty) data.market = null;
    else if (market.invalid) fail(f.market, 'O valor de mercado deve ser um valor válido, sem números negativos.');
    else data.market = market.value;

    data.refNote = f.refNote.value.trim();
    var refUrl = f.refUrl.value.trim();
    if (refUrl && !U.isSafeUrl(refUrl)) fail(f.refUrl, 'O link da fonte deve começar com http:// ou https://.');
    else data.refUrl = refUrl;

    var contactRaw = f.contact.value.trim();
    if (contactRaw && !U.toWaNumber(contactRaw)) fail(f.contact, 'Informe o WhatsApp do anúncio com DDD, por exemplo (86) 99999-9999.');
    else data.contact = contactRaw;

    var image = f.image.value.trim();
    data.images = formImages.slice();
    if (image) {
      if (!U.isSafeUrl(image)) fail(f.image, 'O link da foto deve começar com http:// ou https://.');
      else if (data.images.length >= C.MAX_IMAGES) fail(f.image, 'Limite de ' + C.MAX_IMAGES + ' fotos por veículo.');
      else if (data.images.indexOf(image) === -1) data.images.push(image);
    }

    data.description = f.description.value.trim();
    return { ok: errors.length === 0, errors: errors, data: data };
  }

  function handleSubmit(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (!P.state.logged) return;
    clearErrors();
    var result = validate();
    if (!result.ok) {
      els.formError.hidden = false;
      els.formError.textContent = result.errors.join(' ');
      try { els.formError.scrollIntoView({ block: 'center' }); } catch (e) {}
      return;
    }
    var vehicles = AG.store.all();
    var message;
    if (editingId) {
      var idx = vehicles.findIndex(function (x) { return x.id === editingId; });
      if (idx === -1) { close(); return; }
      var updated = Object.assign({}, vehicles[idx], result.data);
      delete updated.image;
      vehicles[idx] = updated;
      message = 'Veículo atualizado com sucesso.';
    } else {
      vehicles.unshift(Object.assign({ id: U.newId() }, result.data));
      message = 'Veículo cadastrado com sucesso.';
    }
    editingId = null;
    formImages = [];
    els.form.reset();
    renderPreviews();
    P.render();
    P.showScreen('list');
    P.afterSave(message);
  }

  /* ---------- Fotos ---------- */
  function readAndCompress(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('read')); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('decode')); };
        img.onload = function () {
          var scale = Math.min(1, 900 / Math.max(img.width, img.height));
          var canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPreviews() {
    els.previews.innerHTML = '';
    formImages.forEach(function (src, index) {
      var box = el('div', 'preview');
      var img = el('img');
      img.src = U.isImageSrc(src) ? src : U.placeholderImage('carro');
      img.alt = 'Foto ' + (index + 1);
      box.appendChild(img);
      if (index === 0) box.appendChild(el('span', 'preview-tag', 'Capa'));
      var rm = el('button', 'preview-remove', '×');
      rm.type = 'button';
      rm.setAttribute('aria-label', 'Remover foto ' + (index + 1));
      rm.addEventListener('click', function () { formImages.splice(index, 1); renderPreviews(); });
      box.appendChild(rm);
      els.previews.appendChild(box);
    });
  }

  function handlePhotoSelection() {
    var files = Array.prototype.slice.call(els.photos.files || []);
    els.photos.value = '';
    if (!files.length) return;
    clearErrors();
    var problems = [];
    files.reduce(function (chain, file) {
      return chain.then(function () {
        if (!/^image\//.test(file.type)) { problems.push('"' + file.name + '" não é uma imagem.'); return; }
        if (formImages.length >= C.MAX_IMAGES) { problems.push('Limite de ' + C.MAX_IMAGES + ' fotos por veículo.'); return; }
        return readAndCompress(file).then(function (d) { formImages.push(d); })
          .catch(function () { problems.push('Não foi possível ler "' + file.name + '".'); });
      });
    }, Promise.resolve()).then(function () {
      renderPreviews();
      if (problems.length) {
        els.formError.hidden = false;
        els.formError.textContent = Array.from(new Set(problems)).join(' ');
      }
    });
  }

  function setup() {
    var $ = P.$;
    els = {
      form: $('vehicle-form'), formTitle: $('form-title'), formError: $('form-error'),
      previews: $('image-previews'), photos: $('f-photos')
    };
    els.form.addEventListener('submit', handleSubmit);
    els.photos.addEventListener('change', handlePhotoSelection);
    $('btn-save').addEventListener('click', handleSubmit);
    $('btn-cancel').addEventListener('click', close);
  }

  P.formulario = { open: open, close: close, setup: setup };
})();
