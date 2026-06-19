const musica = document.getElementById("musica");
const btnMusica = document.getElementById("botaoPlay");

btnMusica.addEventListener("click", () => {
    if (musica.paused) {
        musica.play();
        btnMusica.innerHTML = "Pause";
    } else {
        btnMusica.innerHTML = "▶ Tocar música";
        musica.pause();musica.addEventListener("play");
        musica.addEventListener("pause");
        
    }
});
 