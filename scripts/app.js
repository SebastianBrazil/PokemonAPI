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

let savedPokemonArray = [];

if (localStorage.getItem("Pokemon")) {
    savedPokemonArray = JSON.parse(localStorage.getItem("Pokemon"));
};

const FetchPoke = async (input) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    const data = await promise.json();

    PopPoke(data);
};

searchBtn.addEventListener('click', () => {
    FetchPoke(searchInput.value.toLowerCase());
});

const PopPoke = async (data) => {
    normalFront.src = data.sprites.front_default;
    shinyFront.src = data.sprites.front_shiny;

    namePoke.innerText = data.name[0].toUpperCase() + data.name.substring(1);

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
                movesPoke.innerText = data.moves[i].move.name[0].toUpperCase() + data.moves[i].move.name.substring(1);
                break;
            default:
                movesPoke.innerText += ", " + data.moves[i].move.name[0].toUpperCase() + data.moves[i].move.name.substring(1);
                break;
        };
    };

    popEvol(data);
};

const popLocate = async (topData) => {
    const promise = await fetch(`${topData.location_area_encounters}`);
    const data = await promise.json();

    let locationName = data[0].location_area.name.split("-").join(" ");
    let versionName = data[0].version_details[0].version.name[0].toUpperCase() + data[0].version_details[0].version.name.substring(1);

    // for (let i = 0; i < locationName.length; i++){
    //     location[i] = locationName[i][0].toUpperCase() + locationName[i].substring(1);
    //     console.log(locationName);

    // }

    findLocation.innerText = locationName + ", Pokemon " + versionName;
};

const popEvol = async (topData) => {
    const promiseOne = await fetch(`${topData.species.url}`);
    const dataOne = await promiseOne.json();

    const promiseTwo = await fetch(`${dataOne.evolution_chain.url}`);
    const dataTwo = await promiseTwo.json();

    if (dataTwo?.chain?.evolves_to[0]?.evolves_to[0]?.species?.name !== undefined) {
        evol.innerText = dataTwo.chain.species.name + " to " + dataTwo.chain.evolves_to[0].species.name + " to " + dataTwo.chain.evolves_to[0].evolves_to[0].species.name;
    } else {
        if (dataTwo?.chain?.evolves_to[0]?.species?.name !== undefined) {
            evol.innerText = dataTwo.chain.species.name;
            for (let i = 0; i < dataTwo.chain.evolves_to.length; i++) {
                switch (i) {
                    case 0:
                        evol.innerText += " to " + dataTwo.chain.evolves_to[i].species.name;
                        break;
                    default:
                        evol.innerText += "; " + dataTwo.chain.evolves_to[i].species.name;
                        break;
                };
            };
        } else {
            evol.innerText = "N/A"
        };
    };
};