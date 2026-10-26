/* Armazenamento dos veículos (localStorage, com cópia em memória caso o navegador bloqueie).
   Lê também o arquivo dados/dados-veiculos.js, que é a "fonte pública" da vitrine. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var C = AG.config;

  var memory = {};
  var vehicles = [];

  function readKey(key) {
    try { var t = localStorage.getItem(key); if (t !== null) return t; } catch (e) {}
    return memory[key] !== undefined ? memory[key] : null;
  }
  function writeKey(key, text) {
    memory[key] = text;
    try { localStorage.setItem(key, text); return true; } catch (e) { return false; }
  }

  function loadVehicles() {
    try {
      var raw = readKey(C.STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  /* Se existir o arquivo dados-veiculos.js (gerado pelo painel) e ele for mais novo
     do que o que está salvo neste navegador, usa os dados do arquivo. */
  function adoptFileData() {
    var fileData = window.VEHICLES_DATA;
    if (!Array.isArray(fileData)) return;
    var fileTs = Number(window.VEHICLES_UPDATED_AT) || 0;
    var localTs = Number(readKey(C.META_KEY)) || 0;
    if (fileTs > localTs) {
      vehicles = fileData.slice();
      writeKey(C.STORAGE_KEY, JSON.stringify(vehicles));
      writeKey(C.META_KEY, String(fileTs));
      writeKey(C.SEED_FLAG_KEY, '1');
    }
  }

  function save() {
    var ok = writeKey(C.STORAGE_KEY, JSON.stringify(vehicles));
    writeKey(C.META_KEY, String(Date.now()));
    return ok;
  }

  AG.store = {
    readKey: readKey,
    writeKey: writeKey,
    /* Carrega os veículos do navegador e aplica o arquivo de dados, se for mais novo. */
    init: function () { vehicles = loadVehicles(); adoptFileData(); },
    all: function () { return vehicles; },
    set: function (list) { vehicles = list; },
    save: save
  };
})();
