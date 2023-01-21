import './App.css';
import React, {Component} from 'react';
import { useEffect, useState } from 'react';
import Playlists from './components/Playlists';
import Filter from './utils/Filter';
import { Header } from './components/Header';
import dotenv from 'dotenv';

function App () {
  dotenv.config()
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const SCOPE = 'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public';
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

  const [token, setToken] = useState("");

  const [filteredTracks, setFilteredTracks] = useState([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('')


  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1]
      console.log(token)

      window.location.hash = "";
      window.localStorage.setItem("token", token)
    }
    setToken(token)

    // get user ID necessary to access playlist data
    getUserData(token);
    
  }, [])



  const logout = () => {
    setToken("");
    window.localStorage.removeItem('token');

  }

  const getUserData = (token) => {
     fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setUserId(data.id)
        setUsername(data.display_name)
        console.log(userId)
        return userId;
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="App">
      <Header />
      <main>
      <div>
        {!token ?
          <div className='login_wrapper auth'>
            <a id='loginLink' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&show_dialogue=true`}>login to spotify</a>
          </div>
          : <div></div>
        }
      </div>
        {!token ?
          <div>
            Please login to begin using this application.
          </div>
          :
          <div className='my_playlists'>
            <h1>My Playlists</h1>
            
            {token && userId ?
            <div className='scroll_box'>
              <Playlists user_id={userId} token={token} />
            </div>
              : <div className='circle'></div>
            }
          </div>
        }
        {token ? 
        <button id='logoutBtn' className='add_borders auth' onClick={logout}>LOGOUT</button> 
        :
        <div></div>
        
      }
      </main>
    </div>
  );
}

export default App;
