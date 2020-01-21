import {useEffect, useState} from 'react';

export const areaByZoom = {
    10: 2000,
    11: 1000,
    12: 520,
    13: 350,
    14: 250,
    15: 200,
    16: 180,
    17: 140,
    18: 70,
  }
export const getAreaByZoom = (zoom) => areaByZoom[zoom] || areaByZoom[10]
  
export const MESSAGES = {
  COORD_REJECTEDS: 'Parceiro, sem suas coordenadas fica dificil filtrar os usuários. A pagina de cadastro até funfa sem, porém a do mapa talvez não.'
}

export const useCoodsPermissions = () => {
  const [userCoords, setCoords] = useState({ lat: null, lng: null })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
          const {latitude, longitude} = position.coords
          setCoords({ lat: latitude, lng: longitude })
      }, 
      (err) => {
          alert(MESSAGES.COORD_REJECTEDS)
      },
      )
  }, [])
  
  return userCoords
}
