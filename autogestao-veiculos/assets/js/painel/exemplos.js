/* Veículos de exemplo do painel (só são cadastrados na primeira vez, e podem ser
   recuperados pelo botão "Restaurar exemplos"). */
(function () {
  'use strict';
  var AG = window.AutoGestao;

  AG.exemplos = [
    {
      id: 'seed-honda-cg125-titan-ks-2004', type: 'moto', name: '', brand: 'Honda', model: 'CG 125 Titan-KS',
      year: 2004, color: '', km: null,
      description: 'Motocicleta usada, modelo clássico, indicada para deslocamentos cotidianos. Quilometragem, cor, estado de conservação e documentação devem ser confirmados antes de um anúncio real.',
      price: 7500, market: 7500, refNote: 'Estimativa demonstrativa (não é cotação FIPE exata)', refUrl: '', images: []
    },
    {
      id: 'seed-honda-cg125-fan-2014', type: 'moto', name: '', brand: 'Honda', model: 'CG 125 Fan',
      year: 2014, color: '', km: null,
      description: 'Motocicleta de exemplo. Quilometragem, cor, estado de conservação e documentação não foram informados.',
      price: 9569, market: 9569, refNote: 'Tabela FIPE, outubro de 2026 (valor informado pelo cadastrante)',
      refUrl: 'https://fipevalor.com.br/moto/honda/811078-6-cg-125-fan-fan-ks-125-i-fan/2014', images: []
    },
    {
      id: 'seed-honda-cg160-titan-2018', type: 'moto', name: '', brand: 'Honda',
      model: 'CG 160 Titan Flexone / Edição Especial 40 Anos', year: 2018, color: '', km: null,
      description: 'Motocicleta de exemplo. Quilometragem, cor, estado de conservação e documentação não foram informados.',
      price: 13890, market: 13890, refNote: 'Tabela FIPE, outubro de 2026 (valor informado pelo cadastrante)',
      refUrl: 'https://tudodemoto.com.br/moto-street/honda/cg-160-titan/2018/', images: []
    }
  ];
})();
