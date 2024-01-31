let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");

let normalFront = document.getElementById("normalFront");
let shinyFront = document.getElementById("shinyFront");
let namePoke = document.getElementById("namePoke");
let findLocation = document.getElementById("findLocation");
let eleType = document.getElementById("eleType");
let abilities = document.getElementById("abilities");
let movesPoke = document.getElementById("movesPoke");
let evol = document.getElementById("evol");
let favBtn = document.getElementById("favBtn");
let openFav = document.getElementById("openFav");
let idPoke = document.getElementById("idPoke");
let randomPoke = document.getElementById("randomPoke");
let response = document.getElementById("response");

let globalPoke = "";
let savedPokemonArray = [];
let faveClosed = true;

if (localStorage.getItem("Pokemon")) {
    savedPokemonArray = JSON.parse(localStorage.getItem("Pokemon"));
};

const FetchPoke = async (input) => {
    try {
        const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        const data = await promise.json();

        if (data.id > 649) {
            response.innerText = "Pokemon Is Not Available, Up To Gen 5 Only"
        } else {
            globalPoke = data.name;
            response.innerText = "";
            searchInput.value = "";
            PopPoke(data);
        };
    } catch {
        response.innerText = "Could Not Get Pokemon. Check Spelling Or Input Valid ID"
    };
};

// FetchPoke(1);

searchBtn.addEventListener('click', () => {
    if (searchInput.value.toLowerCase() !== "") {
        FetchPoke(searchInput.value.toLowerCase());
    } else {
        response.innerText = "Search is Empty";
    };
    openFav.innerHTML = "";
});

randomPoke.addEventListener('click', () => {
    let randomNum = 1 + Math.floor(Math.random() * 649);
    FetchPoke(randomNum);
    openFav.innerHTML = "";
});

const PopPoke = async (data) => {
    normalFront.src = data.sprites.front_default;
    shinyFront.src = data.sprites.front_shiny;

    namePoke.innerText = data.name[0].toUpperCase() + data.name.substring(1);
    idPoke.innerText = "ID: #" + data.id;

    popLocate(data);

    for (let i = 0; i < data.types.length; i++) {
        switch (i) {
            case 0:
                eleType.innerText = data.types[i].type.name[0].toUpperCase() + data.types[i].type.name.substring(1);
                break;
            default:
                eleType.innerText += ", " + data.types[i].type.name[0].toUpperCase() + data.types[i].type.name.substring(1);
                break;
        };
    };

    for (let i = 0; i < data.abilities.length; i++) {
        switch (i) {
            case 0:
                abilities.innerText = data.abilities[i].ability.name[0].toUpperCase() + data.abilities[i].ability.name.substring(1);
                break;
            default:
                abilities.innerText += ", " + data.abilities[i].ability.name[0].toUpperCase() + data.abilities[i].ability.name.substring(1);
                break;
        };
    };

    for (let i = 0; i < data.moves.length; i++) {
        switch (i) {
            case 0:
                let allCapsMove = data.moves[i].move.name.split("-");
                for (let i = 0; i < allCapsMove.length; i++) {
                    allCapsMove[i] = allCapsMove[i][0].toUpperCase() + allCapsMove[i].substring(1);
                }
                movesPoke.innerText = allCapsMove.join("-");
                break;
            default:
                let allCapsMoveFollow = data.moves[i].move.name.split("-");
                for (let i = 0; i < allCapsMoveFollow.length; i++) {
                    allCapsMoveFollow[i] = allCapsMoveFollow[i][0].toUpperCase() + allCapsMoveFollow[i].substring(1);
                }
                movesPoke.innerText += ", " + allCapsMoveFollow.join("-");
                break;
        };
    };

    popEvol(data);
};

const popLocate = async (topData) => {
    const promise = await fetch(`${topData.location_area_encounters}`);
    const data = await promise.json();

    if (data[0]?.location_area?.name !== undefined) {
        let locationName = data[0].location_area.name.split("-");
        for (let i = 0; i < locationName.length; i++) {
            locationName[i] = locationName[i][0].toUpperCase() + locationName[i].substring(1);
        }
        findLocation.innerText = locationName.join(" ") + ", Pokemon " + data[0].version_details[0].version.name[0].toUpperCase() + data[0].version_details[0].version.name.substring(1);
    } else {
        findLocation.innerText = "N/A";
    };
};

const popEvol = async (topData) => {
    const promiseOne = await fetch(`${topData.species.url}`);
    const dataOne = await promiseOne.json();

    const promiseTwo = await fetch(`${dataOne.evolution_chain.url}`);
    const dataTwo = await promiseTwo.json();

    if (dataTwo?.chain?.evolves_to[0]?.species?.name !== undefined) {
        evol.innerText = dataTwo.chain.species.name[0].toUpperCase() + dataTwo.chain.species.name.substring(1);
        for (let i = 0; i < dataTwo.chain.evolves_to.length; i++) {
            switch (i) {
                case 0:
                    evol.innerText += " to " + dataTwo.chain.evolves_to[0].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].species.name.substring(1);
                    if (dataTwo?.chain?.evolves_to[0]?.evolves_to[0]?.species?.name !== undefined) {
                        for (let j = 0; j < dataTwo.chain.evolves_to[0].evolves_to.length; j++) {
                            switch (j) {
                                case 0:
                                    evol.innerText += " to " + dataTwo.chain.evolves_to[0].evolves_to[0].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].evolves_to[0].species.name.substring(1);
                                    break;
                                default:
                                    evol.innerText += "; " + dataTwo.chain.evolves_to[0].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].species.name.substring(1) + " to " + dataTwo.chain.evolves_to[0].evolves_to[j].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].evolves_to[j].species.name.substring(1);
                                    break;
                            };
                        };
                    };
                    break;
                default:
                    evol.innerText += "; " + dataTwo.chain.species.name[0].toUpperCase() + dataTwo.chain.species.name.substring(1) + " to " + dataTwo.chain.evolves_to[i].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[i].species.name.substring(1);
                    if (dataTwo?.chain?.evolves_to[i]?.evolves_to[0]?.species?.name !== undefined) {
                        for (let j = 0; j < dataTwo.chain.evolves_to[i].evolves_to.length; j++) {
                            switch (j) {
                                case 0:
                                    evol.innerText += " to " + dataTwo.chain.evolves_to[i].evolves_to[j].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].evolves_to[0].species.name.substring(1);
                                    break;
                                default:
                                    evol.innerText += "; " + dataTwo.chain.evolves_to[i].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[i].species.name.substring(1) + " to " + dataTwo.chain.evolves_to[i].evolves_to[j].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[i].evolves_to[j].species.name.substring(1);
                                    break;
                            };
                        };
                    };
                    break;
            };
        };
    } else {
        evol.innerText = "N/A"
    };
};

favBtn.addEventListener("click", function (e) {
    if (globalPoke === "") {
        console.log("Debug Log");
    } else
        if (globalPoke !== "" && globalPoke !== savedPokemonArray[savedPokemonArray.indexOf(globalPoke)]) {
            savedPokemonArray.push(globalPoke);
            localStorage.setItem("Pokemon", JSON.stringify(savedPokemonArray));

            console.log(savedPokemonArray);
        } else {
            savedPokemonArray.splice(savedPokemonArray.indexOf(globalPoke), 1);
            localStorage.setItem("Pokemon", JSON.stringify(savedPokemonArray));

            console.log(savedPokemonArray);
        };
});

searchInput.addEventListener("click", function (e) {
    openFav.innerHTML = "";
    if (faveClosed) {
        let holderDiv = document.createElement("div");
        holderDiv.className = "searchBox";

        for (let i = 0; i < savedPokemonArray.length; i++) {
            let favedPoke = document.createElement("a");
            favedPoke.className = "";
            favedPoke.textContent = savedPokemonArray[i]

            favedPoke.addEventListener("click", function (e) {
                FetchPoke(favedPoke.innerText);
                openFav.innerHTML = "";
                faveClosed = true;
            });
            holderDiv.appendChild(favedPoke);
        };
        openFav.appendChild(holderDiv);
        faveClosed = false;
    } else {
        faveClosed = true;
    };
});




