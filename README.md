# Death Music

O Death Music é um site de músicas que estou desenvolvendo como projeto de TCC. A ideia é criar uma plataforma simples para ouvir músicas, pesquisar artistas e montar uma playlist.

Este projeto ainda está em desenvolvimento e foi feito usando HTML, CSS e JavaScript.

## O que o site faz

- Mostra músicas em cards com o nome, artista e imagem da capa.
- Permite tocar e pausar as músicas.
- Mostra o tempo atual e a duração das músicas.
- Possui uma busca por nome da música ou do artista.
- Permite adicionar músicas em uma playlist.
- Possui botões para avançar, voltar, pausar e remover músicas da playlist.
- Possui um menu de usuário onde é possível escolher uma foto do computador.
- Possui um botão **Entrar** no cabeçalho do lobby, que abre a tela de login.
- Permite acessar o cadastro pelo link disponível na tela de login.

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

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, caso ainda não esteja instalada.
3. Clique com o botão direito no arquivo `Death-music lobby.html`.
4. Selecione **Open with Live Server**. A configuração do projeto usa a porta `5501`.

Se preferir, inicie um servidor local com Python:

```bash
python -m http.server 8000
```

Nesse caso, acesse `http://localhost:8000/Death-music%20lobby.html` no navegador.

Use um servidor local para que os arquivos de áudio, imagens e recursos externos funcionem corretamente.

## Páginas do projeto

- `Death-music lobby.html`: página principal do site.
- `cadastro e login/login.html`: página de login, acessada pelo botão **Entrar** no lobby.
- `cadastro e login/cadastro.html`: página de criação de conta, acessada pelo link na tela de login.
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

As páginas de login e cadastro carregam o Google Identity Services por meio de `cadastro e login/google-auth.js`. O botão só é exibido quando o Client ID está configurado:

1. Crie um cliente OAuth do tipo **Aplicativo da Web** no Google Cloud Console.
2. Adicione a origem local usada para testar, por exemplo `http://localhost:5501` com Live Server ou `http://localhost:8000` com Python, às origens JavaScript autorizadas.
3. Substitua `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` pelo Client ID gerado.

O script informa na tela quando falta o Client ID ou quando o SDK do Google não carrega. No estado atual, receber uma credencial do Google não conclui o login nem cria uma conta: é necessário validá-la em um backend e persistir os dados com segurança. Os formulários tradicionais também são demonstrações e não armazenam usuários ou senhas.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- API de áudio do navegador
- Google Identity Services
- Font Awesome via CDN

## O que ainda falta fazer

- Criar um backend para validar credenciais e gerenciar contas com segurança.
- Conectar login e cadastro a um banco de dados.
- Salvar a playlist para ela não desaparecer ao atualizar a página.
- Melhorar a página de cards de músicas.
- Continuar adicionando músicas e ajustando o layout.
