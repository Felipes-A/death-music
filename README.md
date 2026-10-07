# Death Music

Este projeto é um player de música que estou desenvolvendo como parte do meu TCC. A ideia principal foi criar uma interface simples para ouvir músicas, procurar artistas e montar uma playlist sem precisar de algo muito complicado.

Ainda está em andamento, mas já tem a parte visual e a lógica principal funcionando. Foi feito com HTML, CSS e JavaScript, e a intenção é continuar evoluindo ele ao longo do desenvolvimento do projeto.

## O que o site faz

- Mostra músicas em cards com imagem, nome e artista
- Permite tocar e pausar a música
- Exibe o tempo atual e a duração da faixa
- Possui busca por música ou artista
- Permite adicionar músicas em uma playlist
- Tem botões para avançar, voltar e remover músicas
- Possui um perfil de usuário com opção de foto
- Também inclui a parte de login e cadastro, com uma integração inicial com o Google

## Estrutura do projeto

```text
Death-music/
├── Death-music lobby.html          # Página principal da biblioteca
├── interface.css                  # Estilos da interface principal
├── script.js                      # Lógica do player, busca e playlist
├── README.md                      # Documentação do projeto
├── audio/                         # Arquivos de áudio
├── imagens/                       # Capas das músicas
├── cadastro e login/
│   ├── cadastro.html              # Tela de cadastro
│   ├── cadastro.css
│   ├── login.html                 # Tela de login
│   ├── login.css
│   └── google-auth.js             # Integração com Google Identity Services
├── cards de musicas/
│   ├── musicas.html              # Página com cards de músicas
│   └── musicas.css
└── index.html                    # Arquivo principal opcional
```

## Como abrir o projeto

### Opção 1: usando Live Server

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão Live Server.
3. Clique com o botão direito no arquivo `Death-music lobby.html`.
4. Selecione `Open with Live Server`.

### Opção 2: usando Python

```bash
python -m http.server 8000
```

Depois é só abrir no navegador:

```text
http://localhost:8000/Death-music%20lobby.html
```

> Precisei usar um servidor local porque alguns arquivos de áudio e imagem podem não funcionar direito se abrir direto no navegador.

## Páginas principais

- `Death-music lobby.html`: página principal do site
- `cadastro e login/login.html`: página de login
- `cadastro e login/cadastro.html`: página para criar conta
- `cards de musicas/musicas.html`: página com os cards das músicas

## Como adicionar uma música

As músicas que aparecem no site estão no array `trackData`, dentro do arquivo `script.js`. Para adicionar outra música, eu faço o seguinte:

1. Coloco o arquivo de áudio na pasta `audio/`
2. Coloco a imagem da capa na pasta `imagens/`
3. Adiciono um objeto ao array `trackData` com `title`, `artist`, `image` e `src`

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

A parte de login foi iniciada com `cadastro e login/google-auth.js`, usando o Google Identity Services. Para funcionar direito, precisa ter um `Client ID` válido no Google Cloud.

Os passos básicos são:

1. Criar um cliente OAuth do tipo `Aplicativo da Web` no Google Cloud Console.
2. Adicionar os domínios locais do projeto, como `http://localhost:5501` ou `http://localhost:8000`.
3. Substituir o valor de `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` pelo Client ID gerado.

Eu também entendi que essa parte ainda é bem inicial. Hoje ela não salva usuários de verdade nem conclui o login de forma completa, porque isso exigiria um backend para validar as credenciais e armazenar os dados com segurança. Então, por enquanto, ela está mais como uma base para continuar no futuro.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- API de áudio do navegador
- Google Identity Services
- Font Awesome via CDN

## O que ainda falta

Ainda tem bastante coisa para melhorar, e eu estou aprendendo no processo. Alguns pontos que faltam são:

- criar um backend para autenticação real
- conectar login e cadastro a um banco de dados
- salvar a playlist para não sumir ao atualizar a página
- melhorar a organização do código
- continuar adicionando músicas e ajustando o layout
- desenvolver a parte mais completa da aplicação para ficar mais funcional

## Observação final

Esse projeto ainda está em desenvolvimento, então muita coisa pode mudar ao longo do tempo. Eu estou usando esse README como uma forma de documentar o que já foi feito e também deixar claro o que ainda precisa ser melhorado.
