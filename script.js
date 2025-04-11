
const fetch = require('node-fetch');
const fs = require('fs');
const auth = require('./auth.js')
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = auth
async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
}

async function getTopTracks(page, limit) {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
        `v1/me/top/tracks?time_range=long_term&limit=${limit}&offset=${page * limit}`, 'GET'
    )).items;
}

async function start() {
    const trackAmount = 200
    const maxPerFetch = 50
    const times = trackAmount / maxPerFetch
    let rawData = []

    for (let page = 1; page <= times; page++) {

        data = await getTopTracks(page, maxPerFetch);
        rawData = [...rawData, ...data]
    }

    // console.log(topTracks)
    // console.log(topTracks)
    const writeStream = fs.createWriteStream('example.json');
    const tracks = rawData.map(track => ({ id: track.id, name: track.name, artist: track.artists[0].name }))
    console.log(`Fetching found: ${tracks.length} Tracks`)
    writeStream.write(JSON.stringify(tracks));
    writeStream.end();
    console.log("Json complete")
}


start()
