import './App.css';
import { useEffect, useState } from 'react';
import Playlist from './components/Playlist';
import Filter from './utils/Filter';

function App() {
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const SCOPE = 'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public';
  const CLIENT_ID = 'd5143240a18b4d3a9b8c61e323ad2e5f';
  const REDIRECT_URI = 'http://localhost:3000/';

  const [token, setToken] = useState("");

  const [filteredTracks, setFilteredTracks] = useState([]);
  const [userId, setUserId] = useState('');


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
      }, 
      json: true
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setUserId(data.id)
        console.log(userId)
        return userId;
      })
      .catch(err => {
        console.log(err)
      })
  }


  return (
    <div className="App">
      <div className='auth'>
        {!token ?
          <div className='login_wrapper'>
            <a id='loginLink' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&show_dialogue=true`}>login to spotify</a>
          </div>
          : <button id='logoutBtn' onClick={logout}>LOGOUT</button>
        }
      </div>
      <main>
        {!token ?
          <div>
            Please login to begin using this application.
          </div>
          :
          <div className='my_playlists'>
            <h1>My Playlists:</h1>
            {token && userId ?
              <Playlist user_id={userId} token={token} />
              : <h3>no playlists yet</h3>
            }
          </div>
        }
      </main>
    </div>
  );
}

export default App;
