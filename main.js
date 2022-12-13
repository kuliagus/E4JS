const container = document.querySelector('#caja');
const loader = document.querySelector('.pokeballs-container');
const box = document.getElementsByClassName('box');
const llamarApi = document.getElementById('llamarAPI');
const apiError = document.getElementById('apiError')


const api = async (id) => {
    try {
        const res = await fetch(`'https://pokeapi.co/api/v2/pokemon/${id}`)
        const data = await res.json()
        console.log(data)
        pintarCard(data)
    } catch (error) {
        console.log(error)
    }
}


const numeros = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

console.log(numeros(1, 20))


const baseURL = 'https://pokeapi.co/api/v2/pokemon';


let isFetching = false;

const nextURL = {
    next: null
}

const fetchPokemons = async () => {
    const response = await fetch(`${baseURL}?offset=8&limit=10`)
    const data = await response.json()
    return data;
}


const renderPokemonList = pokemonsList => {
    const cardsHtml = pokemonsList.map(pokemon => getPokemonHtml(pokemon)).join('')
    container.innerHTML += cardsHtml
}

const loadAndPrint = pokemonsList => {
    loader.classList.add('show')
    setTimeout(() => {
        loader.classList.remove('show');
        renderPokemonList
        isFetching = false;
    }, 1000)
}

function init() {
    window.addEventListener('DOMContentLoaded', async () => {
        const { next, results } = await fetchPokemons()
        console.log(next, 'next', results, 'results')

        nextURL.next = next;

        const URLS = results.map(pokemon => pokemon.url)
        console.log(URLS, 'TODAS LAS URLS')

        const infoPokemones = await Promise.all(
            URLS.map(async url => {
                const nextPokemon = await fetch(url);
                return await nextPokemon.json()

            })

        )

        console.log('Informacion de los Pokemones', infoPokemones)

    })


    window.addEventListener('scroll', async () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement
        console.log('scrollTop', scrollTop)
        console.log('clientHeight', clientHeight)
        console.log('scrollHeight', scrollHeight)

        const isAtTheBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if (isAtTheBottom && !isFetching) {
            console.log('estoy al fondo')
            isFetching = true;
            console.log('llamando api')
            const nextPokemonsResponse = await fetch(nextURL.next)
            const { next, results } = await nextPokemonsResponse.json()
            nextURL.next = next

            const URLS = results.map(pokemon => pokemon.url)
            console.log(URLS, 'TODAS LAS URLS')

            const infoPokemones = await Promise.all(
                URLS.map(async url => {
                    const nextPokemon = await fetch(url);
                    return await nextPokemon.json()
                })
            )

            loadAndPrint(infoPokemones)

        }
    })

}

init()