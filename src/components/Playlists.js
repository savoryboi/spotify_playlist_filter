import { useState, useEffect } from "react";
import Filter from "../utils/Filter";
import axios, { all } from "axios";

function Playlists(props) {
    const [allUserPlaylists, setAllUserPlaylists] = useState([]);

    // use props to retrieve user playlists... only done on page load to avoid maxing out request limit
    useEffect(() => {
        const user_id = props.user_id;
        const token = props.token;
  
        getPlaylists(user_id, token);        

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
        console.log(response.data.items)

        
        const removeSpotlessPlaylists = (arr, prop, str) => {
            return arr.filter(obj => !obj[prop].includes(str));
        }
        
        const dirty = removeSpotlessPlaylists(response.data.items, 'name', '[Clean] ')
        
        setAllUserPlaylists(dirty)

        
        const playlistDivs = document.querySelectorAll(".playlist_wrapper");
        playlistDivs.forEach(div => {
            div.classList.add('add_borders')
        })
        const scrollDiv = document.querySelector('.scroll_box');
        scrollDiv.classList.add('add_borders');
  
    }

    return (
        <div className='all_user_playlists'>
            { props.token && allUserPlaylists ? allUserPlaylists.map(playlist => {
           
                return <div key={playlist.id} id={playlist.name} className="playlist_wrapper">
                    <aside>
                    <h3>{playlist.name}</h3>
                    <p>created by: {playlist.owner.display_name}</p>
                    
                    </aside>
                    <button className="filterBtn" id={playlist.id + '_btn'} onClick={() => {
                        Filter(playlist.id, props.token, props.user_id, playlist.name)
                        }}>FILTER</button>
                    </div>
            } ) : 
            <div className="circle"></div>}
        </div>
    )
}

export default Playlists;