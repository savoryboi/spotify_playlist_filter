import { useState, useEffect } from "react";
import Filter from "../utils/Filter";
import axios, { all } from "axios";

function Playlists(props) {
    const [allUserPlaylists, setAllUserPlaylists] = useState([]);

    // use props to retrieve user playlists... only done on page load to avoid maxing out request limit
    useEffect(() => {
        const user_id = props.user_id;
        const token = props.token;

        getPlaylists(user_id, token)
    }, [])

   async function getPlaylists(user_id, token) {
        // Make the GET request using user id
        const response = await axios.get(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
            params: {
                limit: 50
            },
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            }, 
            json: true, 
            
        })

        setAllUserPlaylists(response.data.items)
  
    }

    return (
        <div className='all_user_playlists'>
            { props.token && allUserPlaylists ? allUserPlaylists.map(playlist => {
           
                return <div key={playlist.id} className="playlist_wrapper">
                    <aside>
                    <h3>{playlist.name}</h3>
                    <p>created by: {playlist.owner.display_name}</p>
                    
                    </aside>
                    <button className="filterBtn" id={playlist.id + '_btn'} onClick={() => {
                        Filter(playlist.id, props.token, props.user_id, playlist.name)
                        }}>FILTER</button>
                    </div>
            } ) : <div>I dont see anything weirdo</div>}
        </div>
    )
}

export default Playlists;