import './App.css';
import React, {Component} from 'react';
import { useEffect, useState } from 'react';
import Playlists from './components/Playlists';
import Filter from './utils/Filter';
import { Header } from './components/Header';

function App () {
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const SCOPE = 'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public';
  const CLIENT_ID = 'd5143240a18b4d3a9b8c61e323ad2e5f';
  const REDIRECT_URI = 'http://localhost:3000/';

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
      <div className='auth'>
        {!token ?
          <div className='login_wrapper'>
            <a id='loginLink' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&show_dialogue=true`}>login to spotify</a>
          </div>
          : <div></div>
        }
      </div>
      <main>
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
        <button id='logoutBtn' onClick={logout}>LOGOUT</button> :
        <div></div>
        
      }
      </main>
    </div>
  );
}

export default App;
