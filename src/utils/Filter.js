import { useState, useEffect } from 'react';

async function Filter(id, token, user_id, playlist_name) {

    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json', 
            'Content-Length': 92
        },
        json: true
    });

    const data = await response.json();
    
    console.log(data)

    const unfilteredPlaylist = data.items;

    const allTracks = unfilteredPlaylist.map(track => {
        return track.track;
    });

    const filtered = allTracks.filter(track => track.explicit === false);

    const createNewPlaylist = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: 'POST', 
        headers: {
            'Authorization': 'Bearer ' + token
        }, 
        body: JSON.stringify({name: 'CLEAN: ' + playlist_name})
    })

    const jsonPlaylistData = await createNewPlaylist.json()
    console.log(jsonPlaylistData);

    const newPlaylist = {
        id: jsonPlaylistData.id, 
        name: jsonPlaylistData.name
    };

    const cleanTracksUris = filtered.map(track => track.uri);

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