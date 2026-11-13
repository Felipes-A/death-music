# Death Music

Este projeto é um player de música que estou desenvolvendo como parte do meu TCC. A ideia principal foi criar uma interface simples e funcional para ouvir músicas, procurar artistas e montar uma playlist sem complicar demais.

Ainda está em andamento, mas a parte visual e a lógica principal já estão funcionando. Foi feito com HTML, CSS e JavaScript puro, e eu estou aprendendo muito no processo enquanto vou melhorando o projeto.

## Status do projeto

- Em desenvolvimento
- Interface principal funcionando
- Player de música funcionando
- Login e cadastro básicos funcionando localmente
- Integração com Google iniciada, mas ainda incompleta
- Ainda não tem backend nem banco de dados real

## O que o site faz

- Mostra músicas em cards com imagem, nome e artista
- Permite tocar e pausar a música
- Exibe o tempo atual e a duração da faixa
- Possui busca por música ou artista
- Permite adicionar músicas em uma playlist
- Tem botões para avançar, voltar e remover músicas
- Possui um perfil de usuário com opção de foto
- Inclui páginas de login e cadastro
- Salva algumas informações no navegador com `localStorage`

## Estrutura do projeto

```text
Death-music/
├── Death-music lobby.html          # Página principal da biblioteca e player
├── interface.css                   # Estilos da interface principal
├── script.js                       # Lógica do player, busca, playlist e perfil
├── server.js                       # Rotas da API, autenticação e banco SQLite
├── package.json                    # Dependências e comando para iniciar o servidor
├── .gitignore                      # Arquivos locais que não entram no Git
├── README.md                       # Documentação do projeto
├── audio/                          # Arquivos de áudio usados no player
├── imagens/                        # Imagens das capas e logo do projeto
├── cadastro e login/
│   ├── cadastro.html              # Página de cadastro
│   ├── cadastro.css               # Estilos da tela de cadastro
│   ├── login.html                 # Página de login
│   ├── login.css                  # Estilos da tela de login
│   ├── auth.js                    # Envio de cadastro e login para a API
│   └── google-auth.js             # Inicialização do Google Identity Services
├── cards de musicas/               # Pasta reservada para futuras telas ou componentes
└── .vscode/
    └── settings.json               # Configuração local do editor
```

> Foi preciso ajustar a estrutura para refletir os arquivos que realmente existem no projeto. Algumas coisas da versão inicial foram sendo alteradas conforme o desenvolvimento foi avançando.

## Como abrir o projeto

O cadastro, o login e o salvamento por usuário precisam do servidor Node.js. Para executar:

1. Instale o Node.js 20 ou mais recente.
2. Abra um terminal na pasta do projeto.
3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm start
```

Abra o endereço mostrado no terminal (por padrão `http://localhost:3000`). O banco SQLite é criado automaticamente em `data/death-music.sqlite`.

> Não abra as páginas com Live Server ou diretamente pelo arquivo: nesse caso, as rotas do backend não estarão disponíveis.

## Páginas principais

- `Death-music lobby.html`: página principal da biblioteca e player
- `cadastro e login/login.html`: página de login
- `cadastro e login/cadastro.html`: página de cadastro
- `script.js`: onde ficam as principais funções do projeto

## Como adicionar uma música

As músicas que aparecem no site estão no array `trackData`, dentro do arquivo `script.js`. Para adicionar mais uma música, eu faço o seguinte:

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

## Login e cadastro

Cadastro e login são enviados para o backend em `server.js`. As senhas são armazenadas com hash, e a sessão usa um cookie HTTP-only. O banco SQLite guarda as contas, as fotos de perfil e as playlists separadamente por usuário. A playlist de quem não está conectado continua sendo salva no navegador.

## Login com Google

A parte de Google foi iniciada no arquivo `cadastro e login/google-auth.js`. Ela ainda não conclui a autenticação: falta configurar um Client ID e validar a credencial do Google no servidor.

Para isso funcionar de verdade, seria necessário:

1. Criar um projeto no Google Cloud Console
2. Configurar um OAuth Client do tipo `Aplicativo da Web`
3. Adicionar origens autorizadas como `http://localhost:8000`
4. Substituir o valor de `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
5. Validar o token em um servidor

Então, por enquanto, essa parte está mais como uma base para continuar no futuro.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- Node.js e Express
- SQLite (`better-sqlite3`)
- API de áudio do navegador
- LocalStorage para visitantes
- Google Identity Services
- Font Awesome via CDN

## O que ainda falta

Ainda tem várias coisas para melhorar, e eu estou aprendendo no processo. Alguns pontos que ainda preciso desenvolver são:

- recuperação de senha
- configurar a validação de login com Google
- melhorias na organização das playlists
- melhoria na organização do código
- mais músicas e ajustes no layout
- deixar a aplicação mais completa e funcional no geral

## Observação final

Esse projeto ainda está em desenvolvimento, então muita coisa pode mudar ao longo do tempo. Eu estou usando esse README como forma de registrar o que já foi feito e também deixar claro o que ainda precisa ser melhorado.

Acho que esse projeto me ajudou bastante a entender melhor HTML, CSS, JavaScript e a lógica por trás de uma interface web de música. Ainda tem muita coisa para aprender, mas eu consegui criar algo funcional e bem próximo do que eu queria no começo.
