// import React, { useEffect, useState } from 'react';
import React, { useState } from 'react';
import { RegisterDev } from './containers/Form/devForm'
import { DevList } from './containers/ListDevs/devList'
import './global.css'
import './App.css'
import MapPAge from './pages/MapPage';
import { useCoodsPermissions } from './utils';
import Header from './components/header/Header';
import useFetchingDevs from './service/useFetchingDevs';

const App = () => {
  // PAGE CONFIG
  const [shouldBeInRegisterPage, setshouldBeInRegisterPage] = useState(true)

  // useEffect(() => { window.innerWidth < 800 && setshouldBeInRegisterPage(false) }, [])

  // PERMISSION TO GET COORDS
  const userCoords = useCoodsPermissions()

  // DATA FETCH CONFIG
  const { allUsers, setAllUsers, devs } = useFetchingDevs()

  const pageComponent = shouldBeInRegisterPage ? (
    <div className='mainContainer' >
      <RegisterDev setAllUsers={setAllUsers} {...userCoords} />
      <DevList allUsers={allUsers} />
    </div >
  ) : <MapPAge {...userCoords} devs={devs} />

  return (
    <React.Fragment>
      {JSON.stringify(userCoords, undefined, 2)}
      <Header shouldBeInRegisterPage={shouldBeInRegisterPage} setshouldBeInRegisterPage={setshouldBeInRegisterPage} />
      {pageComponent}
    </React.Fragment>
  )

}

export default App;
