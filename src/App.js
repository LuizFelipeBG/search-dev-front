import React, { useEffect, useState } from 'react';
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

  useEffect(() => { window.innerWidth < 800 && setshouldBeInRegisterPage(false) }, [])

  // PERMISSION TO GET COORDS
  const { userCoords, setCoords } = useCoodsPermissions()

  // DATA FETCH CONFIG
  const { allUsers, setAllUsers, devs } = useFetchingDevs()

  const handleManualCoords = (e, latRef, lngRef) => {
    const lat = latRef.current.value
    const lng = lngRef.current.value
    
    if (e.keyCode === 13 && lat && lng) {
      setCoords({ lat, lng })
      // in case of overwriting bad geolocation services
      localStorage.setItem('manual_coords', JSON.stringify({ lat, lng }))
    }
  }
  const coordsProps = { ...userCoords, handleManualCoords }

  const pageComponent = shouldBeInRegisterPage ? (
    <div className='mainContainer' >
      <RegisterDev setAllUsers={setAllUsers} {...coordsProps} />
      <DevList allUsers={allUsers} setAllUsers={setAllUsers}/>
    </div >
  ) : <MapPAge {...coordsProps} allUsers={allUsers} devs={devs} />

  return (
    <React.Fragment>
      <Header shouldBeInRegisterPage={shouldBeInRegisterPage} setshouldBeInRegisterPage={setshouldBeInRegisterPage} />
      {pageComponent}
    </React.Fragment>
  )

}

export default App;
