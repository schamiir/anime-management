const searchAnime = document.getElementById('searchAnime')
const deleteAnime = document.getElementById('delete')

// searchAnime.addEventListener('click', searchAnimeFunc)
deleteAnime.addEventListener('click', deleteAnimeFunc)

// Array.from(addAnime).forEach(ele => ele.addEventListener('click', getFetch))

function renderRandomAnimeImg(item){
    const  array = item.data

    const ul = document.getElementById('randomList')

    for(let i = 0; i < array.length; i++){
        const img = document.createElement('img')
        const p = document.createElement('p')
        ul.appendChild(img).src = `${array[i].attributes.posterImage.medium}`  
    }
    
    
    
    /* When I click on a random anime 
I want to be able to click on each image that is displayed 
I want a title - description - episode count 
*/
}


async function renderRandomAnime() {
    try {

        const randomNumber = Math.floor(Math.random() * 1000)
        const response = await fetch(`https://kitsu.io/api/edge/anime?page[limit]=5&page[offset]=${randomNumber}`)

        const data = await response.json()

        renderRandomAnimeImg(data)
        
        // make a loop to display episode 

        /*
        How to search anime 

        - Anime Title 
        base api url + 
        anime?filter[text]="animetitle" 
        if there is a space between anime title, replace space with %20
        
        - Category 
        base api url + 
        /anime?filter[categories]="category name"

        

        - Limit search = Pagination
        base api url + 
        https://kitsu.io/api/edge/anime?page[limit]=10&page[offset]=0 
        limit = how many animes 
        offset = where to start from - math.random ???
        */


    } catch (error){
        console.log(error)
    }
}

renderRandomAnime()

function deleteAnimeFunc() {
    const obj = this.parentNode.dataset._id
    fetch('/',{
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        title: obj
        })

    })
    .then(res => {
        console.log(res)
    })
}

// async function searchAnimeFunc() {
//     const userInput = document.getElementById('userInput').value.toLowerCase()
//     console.log(userInput)

//     const response = await fetch (`https://kitsu.io/api/edge/anime?filter[text]=${userInput}`)

//     const data = await response.json() // changes the data to JSON file
//     const attributePath = data.data[0].attributes // path of api data

//     document.getElementById('searchedAnime').src = attributePath.posterImage.medium // Fetching the anime images


//     document.getElementById('episodes').textContent = `Total episodes: ${attributePath.episodeCount}` // Number of episodes
// }







/* When I click on a random anime 
I want to be able to click on each image that is displayed 
I want a title - description - episode count 
I also need a button to give the users a choice of adding it to their anime list
*/