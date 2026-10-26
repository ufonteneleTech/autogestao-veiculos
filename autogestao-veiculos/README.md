# AutoGestão Veículos

Site estático (HTML, CSS e JavaScript puro, sem instalação nem build) para anunciar **carros, motos e outros** veículos.
Tem duas partes independentes:

| Parte | Endereço | Para quem | O que faz |
|---|---|---|---|
| **Vitrine** | `vitrine/` | Compradores (público) | Lista os veículos com foto, preço e descrição, busca, filtro por tipo, detalhes e botão de WhatsApp. Não edita nada. |
| **Painel do vendedor** | `painel/` | Só o vendedor (login) | Cadastra, edita e exclui veículos, mostra totais, pré-visualiza a vitrine e gera o arquivo de dados que a vitrine publica. |

A página inicial (`index.html`) só oferece a escolha entre as duas.

## Estrutura

```
autogestao-veiculos/
├── index.html                  Página inicial (escolha: vitrine ou painel)
├── vitrine/index.html          Página da VITRINE
├── painel/
│   ├── index.html              Página do PAINEL
│   └── acesso.local.example.js Modelo do login (copie para acesso.local.js)
├── dados/dados-veiculos.js     Veículos publicados (gerado pelo painel)
└── assets/
    ├── css/
    │   ├── base.css            Variáveis, layout, botões, alertas (todas as páginas)
    │   ├── catalogo.css        Cards, busca, filtros, detalhes (vitrine + painel)
    │   ├── painel.css          Menu, totais, formulário, login (só painel)
    │   └── inicio.css          Página inicial
    └── js/
        ├── compartilhado/      Usado pelas duas partes
        │   ├── config.js         Telefones e constantes
        │   ├── utilitarios.js    Formatação, imagens, WhatsApp, filtro
        │   ├── armazenamento.js  Leitura/gravação dos veículos
        │   ├── detalhe.js        Tela de detalhes do anúncio
        │   └── contato.js        Barras de contato e rodapé
        ├── vitrine/            VITRINE
        │   ├── vitrine.js        Cards, busca e filtro por tipo
        │   └── iniciar.js        Inicia a página pública
        └── painel/             PAINEL DO VENDEDOR
            ├── nucleo.js         Telas, menu e mensagens
            ├── acesso.js         Login e sessão
            ├── lista.js          Totais, lista, editar e excluir
            ├── formulario.js     Cadastro/edição, validação e fotos
            ├── dados.js          Exemplos e exportação dos dados
            ├── exemplos.js       Veículos de exemplo
            ├── previa.js         Prévia da vitrine dentro do painel
            └── iniciar.js        Inicia o painel
```

## Como usar no computador

Basta abrir `index.html` no navegador (duplo clique). Não precisa de servidor.

## Login do painel

O e-mail e a senha **não ficam no código publicado**. Eles ficam em `painel/acesso.local.js`, arquivo que o `.gitignore` impede de ir para o GitHub.

1. Copie `painel/acesso.local.example.js` para `painel/acesso.local.js`.
2. Troque o e-mail e a senha dentro dele.

Sem esse arquivo, a tela de login avisa que o acesso não está configurado.

> **Importante:** o login é só uma trava de tela no navegador, não uma proteção de servidor. Por isso o painel foi pensado para ser usado **no seu computador**, e o que vai para o público é a vitrine. Não use no painel uma senha que você usa em outros lugares.

## Como atualizar os veículos da vitrine

Os veículos e fotos cadastrados no painel ficam salvos **só no navegador de quem cadastrou**. Para o público ver:

1. No painel, cadastre ou altere os veículos.
2. Clique em **⬇ Baixar dados da vitrine**. Será baixado o arquivo `dados-veiculos.js`.
3. Coloque esse arquivo na pasta `dados/`, substituindo o anterior.
4. Envie a alteração ao GitHub (veja abaixo).

Observação: as fotos viajam dentro desse arquivo. Muitas fotos deixam o arquivo (e a vitrine) mais pesados, então prefira poucas fotos por veículo.

## Publicando no GitHub

1. Crie um repositório novo no GitHub (sem README).
2. Na pasta do projeto, rode (o histórico já sai dividido por funcionalidade):

```bash
git init -b main
git add .gitignore README.md index.html dados assets/css/base.css assets/css/inicio.css assets/css/catalogo.css assets/js/compartilhado
git commit -m "Base compartilhada: estilos, configuração, armazenamento e detalhes do anúncio"
git add vitrine assets/js/vitrine
git commit -m "Vitrine pública: lista, busca, filtro por tipo e detalhes"
git add painel assets/css/painel.css assets/js/painel
git commit -m "Painel do vendedor: login, cadastro, edição, exclusão e exportação de dados"
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

3. Para colocar o site no ar: no repositório, abra **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)` e salve.
4. O site fica em `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`. Para os compradores, divulgue o link direto da vitrine: `.../vitrine/`.

Antes do primeiro `git push`, confira com `git status` que `painel/acesso.local.js` **não** aparece na lista de arquivos a enviar.

> Se preferir enviar pelo site do GitHub (arrastando arquivos), **não envie** `painel/acesso.local.js`: o `.gitignore` só vale para o Git, não para o envio pelo navegador.

## Personalização

- **Telefones de contato:** `assets/js/compartilhado/config.js` (muda todas as páginas).
- **Categorias:** Carro, Moto e Outros. Para criar mais uma, inclua o tipo em `utilitarios.js` (`typeLabel`), no `<select>` e nos botões de filtro de `painel/index.html` e `vitrine/index.html`, na contagem em `lista.js` e uma cor de selo em `catalogo.css` (`.badge-novo-tipo`).
- **Cores e visual:** variáveis no início de `assets/css/base.css`.
