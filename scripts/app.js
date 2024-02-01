// Calls all IDs
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

//Declares global variables
let globalPoke = "";
let savedPokemonArray = [];
let faveClosed = true;

//Gathers data from local storage
if (localStorage.getItem("Pokemon")) {
    savedPokemonArray = JSON.parse(localStorage.getItem("Pokemon"));
};

//Fetches data from the PokiAPI about a pokemon
const FetchPoke = async (input) => {
    try {
        const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        const data = await promise.json();

        if (data.id > 649) {
            openFav.innerHTML = "";
            openFav.style.display = "block";
            let holderDiv = document.createElement("div");
            holderDiv.className = "flex justify-start ml-5 mt-3 mb-3";

            let response = document.createElement("p");
            response.className = "text-left sm:text-2xl kotta";
            response.textContent = "Pokemon Is Not Available, Up To Gen 5 Only";

            holderDiv.appendChild(response);
            openFav.appendChild(holderDiv);
        } else {
            globalPoke = data.name;
            searchInput.value = "";
            for (let i = 0; i < savedPokemonArray.length; i++) {
                if (input === savedPokemonArray[i]) {
                    favBtn.src = "./assets/heart.png"
                    break;
                } else {
                    favBtn.src = "./assets/heartOut.png"
                }
            }
            PopPoke(data);
        };
    } catch {
        openFav.innerHTML = "";
        openFav.style.display = "block";
        let holderDiv = document.createElement("div");
        holderDiv.className = "flex justify-start ml-5 mt-3 mb-3";

        let response = document.createElement("p");
        response.className = "text-left sm:text-2xl kotta";
        response.textContent = "Could Not Get Pokemon. Check Spelling Or Input Valid ID";

        holderDiv.appendChild(response);
        openFav.appendChild(holderDiv);
    };
};

//Calls on the fetch function using an image click
searchBtn.addEventListener('click', () => {
    openFav.innerHTML = "";
    if (searchInput.value.toLowerCase() !== "") {
        FetchPoke(searchInput.value.toLowerCase());
        openFav.style.display = "none";
    } else {
        openFav.style.display = "block";
        let holderDiv = document.createElement("div");
        holderDiv.className = "flex justify-start ml-5 mt-3 mb-3";

        let response = document.createElement("p");
        response.className = "text-left sm:text-2xl kotta";
        response.textContent = "Search is Empty";

        holderDiv.appendChild(response);
        openFav.appendChild(holderDiv);
    };
    faveClosed = true;
});

//Calls on the fetch function and inputs a random ID number
randomPoke.addEventListener('click', () => {
    let randomNum = 1 + Math.floor(Math.random() * 649);
    FetchPoke(randomNum);
    openFav.innerHTML = "";
    faveClosed = true;
    openFav.style.display = "none";
});

//Populates all necessary information onto the page
const PopPoke = async (data) => {
    normalFront.src = data.sprites.front_default;
    shinyFront.src = data.sprites.front_shiny;

    namePoke.innerText = data.name[0].toUpperCase() + data.name.substring(1);
    idPoke.innerText = "ID: #" + data.id;

    popLocate(data);

    for (let i = 0; i < data.types.length; i++) {
        switch (i) {
            case 0:
                eleType.innerText = "Type: " + data.types[i].type.name[0].toUpperCase() + data.types[i].type.name.substring(1);
                break;
            default:
                eleType.innerText += ", " + data.types[i].type.name[0].toUpperCase() + data.types[i].type.name.substring(1);
                break;
        };
    };

    for (let i = 0; i < data.abilities.length; i++) {
        switch (i) {
            case 0:
                abilities.innerText = "Abilities: " + data.abilities[i].ability.name[0].toUpperCase() + data.abilities[i].ability.name.substring(1);
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
                for (let j = 0; j < allCapsMove.length; j++) {
                    allCapsMove[j] = allCapsMove[j][0].toUpperCase() + allCapsMove[j].substring(1);
                }
                movesPoke.innerText = "Moves: " + allCapsMove.join("-");
                break;
            default:
                let allCapsMoveFollow = data.moves[i].move.name.split("-");
                for (let j = 0; j < allCapsMoveFollow.length; j++) {
                    allCapsMoveFollow[j] = allCapsMoveFollow[j][0].toUpperCase() + allCapsMoveFollow[j].substring(1);
                }
                movesPoke.innerText += ", " + allCapsMoveFollow.join("-");
                break;
        };
    };

    popEvol(data);
};

//Is called in the popPoke, fetches data needed to populate the location
const popLocate = async (topData) => {
    const promise = await fetch(`${topData.location_area_encounters}`);
    const data = await promise.json();

    if (data[0]?.location_area?.name !== undefined) {
        const promise2 = await fetch(`${data[0].location_area.url}`);
        const data2 = await promise2.json();

        const promise3 = await fetch(`${data2.location.url}`);
        const data3 = await promise3.json();

        if (data3.id < 567) {
            let locationName = data[0].location_area.name.split("-");
            for (let i = 0; i < locationName.length; i++) {
                locationName[i] = locationName[i][0].toUpperCase() + locationName[i].substring(1);
            }
            findLocation.innerText = "Location: " + locationName.join(" ") + ", Pokemon " + data[0].version_details[0].version.name[0].toUpperCase() + data[0].version_details[0].version.name.substring(1);
        } else {
            findLocation.innerText = "Location: N/A";
        }
    } else {
        findLocation.innerText = "Location: N/A";
    };
};

//Is called in the popPoke, fetches data needed to populate the evolution tree. Don't look into the abyss.
const popEvol = async (topData) => {
    const promiseOne = await fetch(`${topData.species.url}`);
    const dataOne = await promiseOne.json();

    const promiseTwo = await fetch(`${dataOne.evolution_chain.url}`);
    const dataTwo = await promiseTwo.json();

    if (dataTwo?.chain?.evolves_to[0]?.species?.name !== undefined) {
        const promValy1 = await fetch(`${dataTwo.chain.evolves_to[0].species.url}`);
        const dataValy1 = await promValy1.json();
        if (dataValy1.id < 650) {
            evol.innerText = "Evolution: " + dataTwo.chain.species.name[0].toUpperCase() + dataTwo.chain.species.name.substring(1);
            for (let i = 0; i < dataTwo.chain.evolves_to.length; i++) {
                switch (i) {
                    case 0:
                        evol.innerText += " to " + dataTwo.chain.evolves_to[0].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].species.name.substring(1);
                        if (dataTwo?.chain?.evolves_to[0]?.evolves_to[0]?.species?.name !== undefined) {
                            for (let j = 0; j < dataTwo.chain.evolves_to[0].evolves_to.length; j++) {
                                switch (j) {
                                    case 0:
                                        const promValyInner1 = await fetch(`${dataTwo.chain.evolves_to[0].evolves_to[0].species.url}`);
                                        const dataValyInner1 = await promValyInner1.json();
                                        if (dataValyInner1.id < 650) {
                                            evol.innerText += " to " + dataTwo.chain.evolves_to[0].evolves_to[0].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].evolves_to[0].species.name.substring(1);
                                        };
                                        break;
                                    default:
                                        const promValyInner2 = await fetch(`${dataTwo.chain.evolves_to[0].evolves_to[j].species.url}`);
                                        const dataValyInner2 = await promValyInner2.json();
                                        if (dataValyInner2.id < 650) {
                                            evol.innerText += "; " + dataTwo.chain.evolves_to[0].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].species.name.substring(1) + " to " + dataTwo.chain.evolves_to[0].evolves_to[j].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[0].evolves_to[j].species.name.substring(1);
                                        };
                                        break;
                                };
                            };
                        };
                        break;
                    default:
                        const promValy2 = await fetch(`${dataTwo.chain.evolves_to[i].species.url}`);
                        const dataValy2 = await promValy2.json();
                        if (dataValy2.id < 650) {
                            evol.innerText += "; " + dataTwo.chain.species.name[0].toUpperCase() + dataTwo.chain.species.name.substring(1) + " to " + dataTwo.chain.evolves_to[i].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[i].species.name.substring(1);
                            if (dataTwo?.chain?.evolves_to[i]?.evolves_to[0]?.species?.name !== undefined) {
                                for (let j = 0; j < dataTwo.chain.evolves_to[i].evolves_to.length; j++) {
                                    switch (j) {
                                        case 0:
                                            const promValyInner3 = await fetch(`${dataTwo.chain.evolves_to[i].evolves_to[0].species.url}`);
                                            const dataValyInner3 = await promValyInner3.json();
                                            if (dataValyInner3.id < 650) {
                                                evol.innerText += " to " + dataTwo.chain.evolves_to[i].evolves_to[0].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[i].evolves_to[0].species.name.substring(1);
                                            };
                                            break;
                                        default:
                                            const promValyInner4 = await fetch(`${dataTwo.chain.evolves_to[i].evolves_to[j].species.url}`);
                                            const dataValyInner4 = await promValyInner4.json();
                                            if (dataValyInner4.id < 650) {
                                                evol.innerText += "; " + dataTwo.chain.evolves_to[i].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[i].species.name.substring(1) + " to " + dataTwo.chain.evolves_to[i].evolves_to[j].species.name[0].toUpperCase() + dataTwo.chain.evolves_to[i].evolves_to[j].species.name.substring(1);
                                            };
                                            break;
                                    };
                                };
                            };
                        };
                        break;
                };
            };
        } else {
            evol.innerText = "Evolution: N/A"
        };
    } else {
        evol.innerText = "Evolution: N/A"
    };
};

// This adds the current pokemon to the 
favBtn.addEventListener("click", function (e) {
    if (globalPoke === "") {
        console.log("Debug Log");
    } else
        if (globalPoke !== "" && globalPoke !== savedPokemonArray[savedPokemonArray.indexOf(globalPoke)]) {
            savedPokemonArray.push(globalPoke);
            localStorage.setItem("Pokemon", JSON.stringify(savedPokemonArray));
            favBtn.src = "./assets/heart.png"

            console.log(savedPokemonArray);
        } else {
            savedPokemonArray.splice(savedPokemonArray.indexOf(globalPoke), 1);
            localStorage.setItem("Pokemon", JSON.stringify(savedPokemonArray));
            favBtn.src = "./assets/heartOut.png"

            console.log(savedPokemonArray);
        };
});

searchInput.addEventListener("click", function (e) {
    openFav.innerHTML = "";
    if (faveClosed) {
        openFav.style.display = "block";

        for (let i = 0; i < savedPokemonArray.length; i++) {
            let holderDiv = document.createElement("div");
            holderDiv.className = "flex justify-start ml-5 mt-3 mb-3";
            holderDiv.addEventListener("click", function (e) {
                FetchPoke(savedPokemonArray[i]);
                openFav.innerHTML = "";
                faveClosed = true;
                openFav.style.display = "none";
            });

            let favedPoke = document.createElement("p");
            favedPoke.className = "text-left sm:text-2xl kotta";
            favedPoke.textContent = savedPokemonArray[i][0].toUpperCase() + savedPokemonArray[i].substring(1);

            let favedImg = document.createElement("img")
            favedImg.className = "w-8 h-8 ml-3";
            favedImg.src = "./assets/heart.png"
            favedImg.alt = "Favorite Image Inside Favorite List";

            holderDiv.appendChild(favedPoke);
            holderDiv.appendChild(favedImg);
            openFav.appendChild(holderDiv);
        };

        faveClosed = false;
    } else {
        openFav.style.display = "none";
        faveClosed = true;
    };
});

//Calls on pokemon id#1 every time the website is loaded
FetchPoke(1);