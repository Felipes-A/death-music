# Death Music

O Death Music é um site de músicas que estou desenvolvendo como projeto de TCC. A ideia é criar uma plataforma simples para ouvir músicas, pesquisar artistas e montar uma playlist.

Este projeto ainda está em desenvolvimento e foi feito usando HTML, CSS e JavaScript.

## O que o site faz

- Mostra músicas em cards com o nome, artista e imagem da capa.
- Permite tocar e pausar as músicas.
- Mostra o tempo atual e a duração da música.
- Possui uma busca por nome da música ou do artista.
- Permite adicionar músicas em uma playlist.
- Possui botões para avançar, voltar, pausar e remover músicas da playlist.
- Possui um menu de usuário onde é possível escolher uma foto do computador.
- Possui páginas separadas para login e cadastro.

## Estrutura do projeto

```text
Death-music/
├── Death-music lobby.html       # Tela principal da biblioteca
├── interface.css                # Estilos da tela principal
├── script.js                    # Cards, busca, áudio, playlist e perfil
├── README.md                    # Documentação do projeto
├── audio/                       # Arquivos de áudio locais
├── imagens/                     # Capas das músicas
├── cadastro e login/
│   ├── cadastro.html            # Tela de criação de conta
│   ├── cadastro.css
│   ├── login.html               # Tela de login
│   ├── login.css
│   └── google-auth.js           # Configuração do Google Identity Services
└── cards de musicas/
    ├── musicas.html             # Página de cards de músicas
    └── musicas.css
```

## Como abrir o projeto

Como o projeto é feito somente com arquivos HTML, CSS e JavaScript, não é necessário instalar muitas coisas. Para abrir:

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, caso ainda não tenha.
3. Clique com o botão direito no arquivo `Death-music lobby.html`.
4. Selecione **Open with Live Server**.

Também dá para iniciar um servidor local usando Python:

```bash
python -m http.server 8000
```

Depois é só acessar `http://localhost:8000/Death-music%20lobby.html` no navegador.

Estou usando um servidor local porque os arquivos de áudio e as imagens ficam dentro do próprio projeto.

## Páginas do projeto

- `Death-music lobby.html`: página principal do site.
- `cadastro e login/login.html`: página de login.
- `cadastro e login/cadastro.html`: página de cadastro.
- `cards de musicas/musicas.html`: página com os cards de músicas.

## Como adicionar uma música

As músicas que aparecem na tela principal estão no array `trackData`, dentro do arquivo `script.js`. Para adicionar outra música:

1. Coloque o arquivo de áudio na pasta `audio/`.
2. Coloque a imagem da capa na pasta `imagens/`.
3. Adicione um objeto com `title`, `artist`, `image` e `src` ao array `trackData`.
4. Confira se os nomes e os caminhos dos arquivos estão corretos.

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

Foi adicionada uma primeira versão do login com Google no arquivo `cadastro e login/google-auth.js`. Para funcionar de verdade, ainda é necessário:

- criar um Client ID no Google Cloud Console;
- trocar `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` pelo Client ID correto;
- configurar os domínios permitidos;
- criar um backend para validar o login.

Por enquanto, o login e o cadastro são apenas uma demonstração. Os formulários levam para a página principal, mas ainda não salvam usuários ou senhas em um banco de dados.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- API de áudio do navegador
- Google Identity Services
- Font Awesome via CDN

## O que ainda falta fazer

- Criar um backend e um banco de dados para os usuários.
- Fazer o login funcionar de forma completa.
- Salvar a playlist para ela não desaparecer ao atualizar a página.
- Melhorar a página de cards de músicas.
- Continuar adicionando músicas e ajustando o layout.
