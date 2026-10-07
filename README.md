# Death Music

Projeto de player de música em HTML, CSS e JavaScript, desenvolvido como ideia para um TCC. A aplicação simula uma biblioteca de música com busca, reprodução de áudio, playlist e perfil de usuário.

O objetivo principal é criar uma interface simples e funcional para ouvir músicas, organizar uma playlist e testar conceitos de UX em um player web.

## Funcionalidades

- Cards de músicas com imagem, título e artista
- Reprodução de áudio com botão de play/pause
- Controle de tempo atual e duração da música
- Busca por música ou artista
- Adição de músicas à playlist
- Navegação entre faixas com botões anterior/próximo
- Remoção de músicas da playlist
- Perfil do usuário com opção de upload de foto
- Tela de login e cadastro com integração inicial de autenticação Google

## Estrutura do projeto

```text
Death-music/
├── Death-music lobby.html          # Página principal / biblioteca
├── interface.css                  # Estilos da interface principal
├── script.js                      # Lógica do player, busca, playlist e perfil
├── README.md                      # Documentação do projeto
├── audio/                         # Arquivos de áudio locais
├── imagens/                       # Imagens e capas das músicas
├── cadastro e login/
│   ├── cadastro.html              # Página de cadastro
│   ├── cadastro.css
│   ├── login.html                 # Página de login
│   ├── login.css
│   └── google-auth.js             # Integração com Google Identity Services
├── cards de musicas/
│   ├── musicas.html              # Página de cards de músicas
│   └── musicas.css
└── index.html                    # Arquivo principal opcional, se existir no projeto
```

## Como executar

### Opção 1: Live Server (recomendado)

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão Live Server.
3. Clique com o botão direito em `Death-music lobby.html`.
4. Selecione `Open with Live Server`.

### Opção 2: Servidor local via Python

```bash
python -m http.server 8000
```

Depois acesse no navegador:

```text
http://localhost:8000/Death-music%20lobby.html
```

> É importante usar um servidor local porque os arquivos de áudio, imagens e outros recursos podem não funcionar corretamente ao abrir diretamente no navegador.

## Páginas principais

- `Death-music lobby.html`: interface principal do player
- `cadastro e login/login.html`: tela de login
- `cadastro e login/cadastro.html`: tela de cadastro
- `cards de musicas/musicas.html`: página de cards de música

## Como adicionar uma música

As músicas exibidas na interface estão no array `trackData` localizado em `script.js`. Para adicionar outra faixa:

1. Coloque o arquivo de áudio na pasta `audio/`
2. Coloque a imagem da capa na pasta `imagens/`
3. Adicione um objeto ao array `trackData` com `title`, `artist`, `image` e `src`

Exemplo:

```js
{
  title: 'Nome da música',
  artist: 'Nome do artista',
  image: 'imagens/capa.jpg',
  src: 'audio/musica.mp3',
},
```

## Login com Google

A integração com o Google foi iniciada em `cadastro e login/google-auth.js` e depende de um `Client ID` válido do Google Cloud.

Para configurar:

1. Crie um cliente OAuth do tipo `Aplicativo da Web` no Google Cloud Console.
2. Adicione os domínios locais do projeto, como `http://localhost:5501` ou `http://localhost:8000`.
3. Substitua o valor de `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` pelo Client ID gerado.

Observação: a autenticaçãoGoogle atual é apenas uma base inicial de integração. Ela não grava usuários no backend e não realiza autenticação completa sem um servidor que valide as credenciais e persista os dados.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Web Audio API
- Google Identity Services
- Font Awesome (CDN)

## Status do projeto

Este projeto ainda está em desenvolvimento. As próximas melhorias incluem:

- criar um backend para autenticação real
- conectar login e cadastro a um banco de dados
- salvar a playlist no navegador ou em servidor
- melhorar a organização do código e a estrutura dos arquivos
- expandir a biblioteca de músicas e aperfeiçoar a interface

## Observação

Este README está sendo atualizado conforme o projeto evolui. Caso queira, posso também criar uma versão mais "profissional" com badges, seções de screenshots e instruções para deploy.
