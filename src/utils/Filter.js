import { useState, useEffect } from 'react';

async function Filter(id, token, user_id, playlist_name) {

    const filterBtn = document.getElementById(id + '_btn');

    
    window.localStorage.setItem('spotlessified', id)
    filterBtn.classList.add('been_filtered');
    filterBtn.innerText = `DONE!`;

    // fetch chosen playlist using the playlist id
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Content-Length': 92
        },
        json: true
    });

    // turn response into json
    const data = await response.json();

    // dig one level deeper into reponse object
    const unfilteredPlaylist = data.items;

    // now that we are into data.items we are in the array of all playlist tracks 
    // map over and return the track object for each item in the unfilteredPlaylist array (line 22)
    const allTracks = unfilteredPlaylist.map(track => {
        return track.track;
    });

    const getCleanVersion = (arr) => {
        arr.forEach(track => {
            if(track.explicit === true){
                fetch(`https://api.spotify.com/v1/search?q=${track.name}&type=track`)
                .then(res => res.json())
                .then(data => console.log(data.items))
            }
        })
    }

    // filter out all explicit tracks in the array
    const filtered = allTracks.filter(track => track.explicit === false);

    // post request to create a new playlist 
    const createNewPlaylist = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ name: '[Clean] ' + playlist_name })
    })

    const jsonPlaylistData = await createNewPlaylist.json()

    // store newly created playlist id and name for when we add the non-explicit tracks to this playlist
    const newPlaylist = {
        id: jsonPlaylistData.id,
        name: jsonPlaylistData.name
    };

    // create an array containing all the URIs for tracks that will be added to new clean playlist
    const cleanTracksUris = filtered.map(track => track.uri);



    // add all non-explicit tracks to the newly created playlist using the array of URIs
    fetch(`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "uris": cleanTracksUris
        })
    })


};

export default Filter;