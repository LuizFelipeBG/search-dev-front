import React, {useEffect, useState} from 'react';
import api from './service/client'
import {RegisterDev} from './containers/Form/devForm'
import {DevList} from './containers/ListDevs/devList'
import './global.css'
import './App.css'

const App = () => {
  const [allUsers, setAllUsers]  = useState([])

  useEffect(() => {
    const getUser = async () => {
      const users = await api.get('/devs')
      setAllUsers(users.data.reverse())
      return users
    } 
    getUser()
  },[])

  const getData =async (obj) => {
    const setUser = await api.post('/devs', obj)
    setAllUsers([setUser.data, ...allUsers])
  }
  
    return (
      <div className='mainContainer'>
        <RegisterDev getData={getData}/>
        <DevList allUsers={allUsers} />
      </div>
    );
  }

export default App;
