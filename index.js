let moviesByVote = "https://api.themoviedb.org/3/discover/movie?api_key=7d5fc19bc307c5d1ca314e7fb11bf51e&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1"
let moviesByRevenue = "https://api.themoviedb.org/3/discover/movie?api_key=7d5fc19bc307c5d1ca314e7fb11bf51e&language=en-US&sort_by=revenue.desc&include_adult=false&include_video=false&page=1"
let fetch = require('node-fetch')
//revenue & vote count

async function movies(url) {
    let response = await fetch(url)
    return response.json();
}
function getTitles(responseObject) {
    const responseArray = Object.values(responseObject)
    const movieData = responseArray[3]
    return movieData.map((movie) => { return movie.title })
}

const reduce = (array, callback, initValue) => {
    let accumulator = (!initValue) ? array.shift() : initValue
    array.forEach((el) => accumulator = callback(accumulator, el))
    return accumulator
}


const intersectionWithReduce = (...arrays) => {
    const reducer = (accumalator, currentArray) =>
        currentArray.filter(arrayItem => accumalator.includes(arrayItem))
    return reduce(arrays, reducer)
}

const joinWithReduce = (...arrays) => {
    const reducer = (accumalator, currentArray) =>
        accumalator.concat(
            currentArray.filter(
                (currentArrayItem) => !accumalator.includes(currentArrayItem)
            )
        );
    return reduce(arrays, reducer);
};
Promise.all([movies(moviesByVote), movies(moviesByRevenue)]).then((values) => {
    const moviesByVoteTitles = getTitles(values[0]) // => contains our moviesByVote movie titles 
    const moviesByRevenueTitles = getTitles(values[1]) // => contains our moviesByRevenue movie titles 
    const intersectingTitles = intersectionWithReduce(moviesByRevenueTitles, moviesByVoteTitles) // => [ 'The Avengers', 'Avatar', 'Avengers: Infinity War', 'Titanic' ]
    const joinTitles = joinWithReduce(moviesByRevenueTitles, moviesByVoteTitles)
    joinTitles.length // => 36
})


