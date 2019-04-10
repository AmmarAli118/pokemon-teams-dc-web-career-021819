const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons/`


const getTrainers= ()=> {
  fetch(TRAINERS_URL)
  .then(res => res.json())
  .then(trainersArray => trainersArray.forEach(createTrainerCard))
}

const createPokemon= (trainerId)=> {
  fetch(POKEMONS_URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'trainer_id': trainerId
    })
  }).then(res => res.json(console.log ("trying to add", res)
  )).then(pokemon => {
        if(!pokemon.error){
          let trainerCard = document.querySelector(`div[data-id='${pokemon["trainer_id"]}']`)
          let pokemonList = trainerCard.querySelector('ul')
          pokemonList.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
        }
      })
}

const releasePokemon= (pokemonId)=> {
  fetch(POKEMONS_URL+pokemonId, {
    method: 'DELETE'
  }).then(res=>res.json())
}

let appContainer = document.querySelector('main')

const createTrainerCard= (trainerObj)=> {
  let trainerCard = document.createElement('div')
  trainerCard.setAttribute('class', 'card')
  trainerCard.dataset.id = trainerObj.id

  trainerCard.innerHTML = renderCard(trainerObj)
  trainerCard.addEventListener('click', handleButton)

  appContainer.append(trainerCard)
}

const renderCard= (trainerObj)=> {
  return `
   <p>${trainerObj.name}</p>
    <button data-trainer-id=${trainerObj.id}>Add Pokemon</button>
    <ul>
      ${trainerObj.pokemons.map( pokemonObj=> {
        return `<li>${pokemonObj.nickname} (${pokemonObj.species})
        <button class="release" data-pokemon-id=${pokemonObj.id}>Release</button></li>`
      }).join('') }
    </ul>`
}

const handleButton= (event)=> {

  if (event.target.className ==='release') {
    let pokeID = parseInt(event.target.dataset.pokemonId)
    event.target.parentNode.remove()
    releasePokemon(pokeID)
  } else if (event.target.innerText === 'Add Pokemon') {
    let trainerId = parseInt(event.target.dataset.trainerId)

    createPokemon(trainerId)
  }
}

const init= ()=> {
  getTrainers()
}

document.addEventListener('DOMContentLoaded', init)
