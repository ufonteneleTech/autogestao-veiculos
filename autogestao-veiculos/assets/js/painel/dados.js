/* PAINEL — dados: exemplos iniciais e exportação do arquivo que alimenta a vitrine. */
(function () {
  'use strict';
  var AG = window.AutoGestao;
  var P = AG.painel, C = AG.config;

  function missingExamples() {
    var vehicles = AG.store.all();
    return AG.exemplos.filter(function (seed) {
      return !vehicles.some(function (v) { return v.id === seed.id; });
    });
  }

  function seedIfNeeded() {
    if (AG.store.readKey(C.SEED_FLAG_KEY) === '1') return;
    var vehicles = AG.store.all();
    missingExamples().forEach(function (seed) { vehicles.push(Object.assign({}, seed)); });
    AG.store.save();
    AG.store.writeKey(C.SEED_FLAG_KEY, '1');
  }

  function restoreSeeds() {
    var vehicles = AG.store.all();
    var missing = missingExamples();
    missing.forEach(function (seed) { vehicles.push(Object.assign({}, seed)); });
    if (missing.length > 0) {
      P.render();
      P.afterSave(missing.length + (missing.length === 1 ? ' exemplo restaurado.' : ' exemplos restaurados.'));
    } else {
      P.showMessage('Todos os exemplos já estão cadastrados.', 'success');
    }
  }

  /* Gera dados-veiculos.js: é esse arquivo (na pasta dados/) que a vitrine publicada lê. */
  function exportData() {
    var ts = Number(AG.store.readKey(C.META_KEY)) || Date.now();
    var text = '// Dados dos veículos (gerado pelo painel do vendedor)\n' +
      'window.VEHICLES_UPDATED_AT = ' + ts + ';\n' +
      'window.VEHICLES_DATA = ' + JSON.stringify(AG.store.all()) + ';\n';
    try {
      var blob = new Blob([text], { type: 'text/javascript' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'dados-veiculos.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      P.showMessage('Arquivo dados-veiculos.js baixado. Coloque-o na pasta dados/ do projeto, substituindo o anterior, para os veículos e fotos aparecerem em qualquer aparelho.', 'success');
    } catch (e) {
      P.showMessage('Não foi possível gerar o arquivo neste navegador.', 'error');
    }
  }

  P.dados = {
    seedIfNeeded: seedIfNeeded,
    setup: function () {
      P.$('btn-restore').addEventListener('click', restoreSeeds);
      P.$('btn-export').addEventListener('click', exportData);
    }
  };
})();
