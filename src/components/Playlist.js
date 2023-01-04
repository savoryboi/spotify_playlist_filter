import { useState, useEffect } from "react";
import Filter from "../utils/Filter";

function Playlist(props) {
    const [allUserPlaylists, setAllUserPlaylists] = useState([]);

    useEffect(() => {
        const user_id = props.user_id;
        const token = props.token;

        getPlaylists(user_id, token)
    }, [])

    function getPlaylists(user_id, token) {
    
        // Make the GET request
        fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }, 
            json: true
        })
            .then(response => response.json())
            .then(data => {
                // The playlists have been retrieved
                console.log(data.items);
                setAllUserPlaylists(data.items);
                return allUserPlaylists;
            })
            .catch(error => {
                // An error occurred
                console.error(error);
            });
    }

    return (
        <div className='all_user_playlists'>
            { props.token && allUserPlaylists ? allUserPlaylists.map(playlist => {
                return <div key={playlist.id} className="playlist_wrapper">
                    <aside>
                    <h3>{playlist.name}</h3>
                    <p>{playlist.owner.display_name}</p>
                    </aside>
                    <button onClick={() => Filter(playlist.id, props.token, props.user_id, playlist.name)}>filter it</button>
                    </div>
            } ) : <div>I dont see anything weirdo</div>}
        </div>
    )
}

export default Playlist;