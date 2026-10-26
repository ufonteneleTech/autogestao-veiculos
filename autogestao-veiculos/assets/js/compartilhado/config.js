/* Configurações compartilhadas entre a vitrine e o painel.
   Para trocar os telefones de contato, edite apenas este arquivo. */
(function () {
  'use strict';
  var AG = window.AutoGestao = window.AutoGestao || {};

  AG.config = {
    // Chaves do navegador (mantidas iguais às versões anteriores para não perder dados)
    STORAGE_KEY: 'autogestao_veiculos_v1',
    SEED_FLAG_KEY: 'autogestao_exemplos_cadastrados_v1',
    META_KEY: 'autogestao_atualizado_em_v1',

    // Contatos que aparecem nos anúncios, nas barras de contato e no rodapé
    PHONE_DISPLAY: '(86) 99922-6218',
    PHONE_WA: '5586999226218',
    PHONE2_DISPLAY: '(86) 98152-7255',
    PHONE2_LINK: 'https://w.app/esclarecimentodeduvida',

    NOT_INFORMED: 'Não informado',
    MAX_IMAGES: 5
  };
})();
