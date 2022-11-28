import { frenchClavier, usClavier } from "./const.js";

const iDJeu = document.getElementById("jeu");
const iDDrapeauAnglais = document.getElementById("drapeau-anglais");
const iDDrapeauFrancais = document.getElementById("drapeau-francais");
const iDChoixClavier = document.getElementById("choixClavier");
const iDEndGame = document.getElementById("end-game");
const iDDessin = document.getElementById("dessin");
const iDFormulaire = document.getElementById("formulaire");
const iDClavier = document.getElementById("clavier");
const idMotCache = document.getElementById("mot");
const iDProposition = document.getElementById("proposition");
const iDBtnValid = document.getElementById("btn-valid");
const iDImagePendu = document.getElementById("image-pendu");

const url = "../data/mots.json";

const motUtilisateur = [];
const listKeyClicked = [];
const maxImage = 8;

let clavier;

let motATrouver;
let noImage = 1;
let nbCoups = 0;

async function motAleatoire() {
    const requete = await fetch(url, {
        method: "GET",
    });

    if (!requete.ok) {
        alert("Un problème est survenu");
    } else {
        const donnees = await requete.json();

        motATrouver =
            donnees[
                Math.floor(Math.random() * donnees.length)
            ].MOT.toLowerCase();

        console.log(motATrouver);
        start();
    }
}

function start() {
    iDJeu.style.display = "none";

    if (!sessionStorage.getItem("clavier")) {
        iDDrapeauAnglais.addEventListener("click", () => {
            clavier = usClavier;
            sessionStorage.setItem("clavier", "US");
            init();
        });
        iDDrapeauFrancais.addEventListener("click", () => {
            clavier = frenchClavier;
            sessionStorage.setItem("clavier", "FRENCH");
            init();
        });
    } else {
        if (sessionStorage.getItem("clavier") === "FRENCH") {
            clavier = frenchClavier;
        } else {
            clavier = usClavier;
        }

        init();
    }
}

function init() {
    iDChoixClavier.style.display = "none";
    iDEndGame.style.display = "none";
    iDJeu.style.display = "";
    afficheTiret(motATrouver);
    iDBtnValid.addEventListener("click", (e) => {
        e.preventDefault();
        const mot = iDProposition.value.toLowerCase();
        nbCoups++;
        if (mot === motATrouver) {
            victoire();
        } else {
            noImage++;
            iDProposition.value = "";
            affichePendu(noImage);
        }
    });
    afficheClavier();
    affecteTouche();
    affichePendu();
}

function afficheClavier() {
    clavier.forEach((el) => {
        let key = document.createElement("div");
        key.textContent = el;
        key.className = "key";
        iDClavier.appendChild(key);
    });
}

function affecteTouche() {
    const keys = document.querySelectorAll(".key");
    keys.forEach((key) => {
        key.addEventListener("click", () => {
            verificationLettre(key);
        });
    });
}

function affichePendu(noImage = 1) {
    const url = "../images/pendu-" + noImage + ".png";

    iDImagePendu.setAttribute("src", url);
    if (noImage === maxImage) {
        defaite();
    }
}

function afficheTiret(mot) {
    for (let index = 0; index < mot.length; index++) {
        let tiret = document.createElement("div");
        tiret.textContent = "_";
        tiret.className = `tiret`;
        tiret.setAttribute("id", `lettre${index}`);
        idMotCache.appendChild(tiret);
    }
}

function afficheEndGame(text) {
    iDFormulaire.style.display = "none";
    iDEndGame.style.display = "";
    iDEndGame.innerHTML = text;
    document.getElementById("btn-start").addEventListener("click", () => {
        location.reload();
    });
}

function defaite() {
    iDEndGame.style.backgroundColor = "var(--color-4)";
    afficheEndGame(
        `<h2>Vous avez perdu</h2><h3>Le mot caché était : ${motATrouver}</h3> <button class="btn" id="btn-start">Recommencer</button>`
    );
}

function victoire() {
    document.getElementById("mot").setAttribute("class", "motDecouvert");
    document.getElementById("mot").textContent = motATrouver;
    iDEndGame.style.backgroundColor = "var(--color-5)";
    afficheEndGame(
        `<h2>Vous avez gagné en ${nbCoups} coups</h2><h3>Le mot caché était : ${motATrouver}</h3> <button class="btn" id="btn-start">Recommencer</button>`
    );
}

function verificationLettre(key) {
    const keyClicked = key.innerText.toLowerCase();
    let keyOK = false;
    if (!listKeyClicked.includes(keyClicked)) {
        nbCoups++;
        console.log(nbCoups);
        listKeyClicked.push(keyClicked);

        for (let index = 0; index < motATrouver.length; index++) {
            if (keyClicked === motATrouver[index]) {
                motUtilisateur[index] = keyClicked;
                document.getElementById(`lettre${index}`).innerText =
                    keyClicked;
                keyOK = true;
            }
        }
        if (!keyOK) {
            key.className += " false";
            noImage++;
            affichePendu(noImage);
        } else {
            key.className += " good";
        }

        if (motATrouver === motUtilisateur.join("")) {
            victoire();
        }
    }
}

window.onload = () => {
    motAleatoire();
};
