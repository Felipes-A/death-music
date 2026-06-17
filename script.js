const musica = document.getElementById("musica");
const btnMusica = document.getElementById("btnMusica");


btnMusica.addEventListener("click", () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();musica.addEventListener("play");
musica.addEventListener("pause");
    }
});
 
musica.addEventListener("play");
musica.addEventListener("pause");