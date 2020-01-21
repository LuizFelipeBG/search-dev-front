import React, { useEffect, useRef } from 'react'
import './SideBar.css'
import { registerAndInsertNewDev } from '../../service/registerAndInsertNewDev';
export const RegisterDev = ({ setAllUsers, lat = '', lng = '' }) => {
  const latRef = useRef(null)
  const lngRef = useRef(null)

  useEffect(() => {
    latRef.current.value = lat
    lngRef.current.value = lng
  }, [lat, lng])

  const getFormData = async (event) => {
    event.preventDefault()
    await registerAndInsertNewDev(event, { lng: lngRef.current.value, lat: latRef.current.value }, setAllUsers)
  }

  return (
    <aside>
      <strong>Cadastrar</strong>
      <form onSubmit={getFormData}>
        <div className="input-block">
          <label>Usuário do GitHub</label>
          <input name="user" required></input>
        </div>

        <div className="input-block">
          <label htmlFor="techs">Tecnologias</label>
          <input name="techs" id="techs" required></input>
        </div>
        <div className="input-group">
          <div className="input-block">
            <label>Latitude</label>
            <input ref={latRef} type='text' required></input>
          </div>
          <div className="input-block">
            <label>Longitude</label>
            <input ref={lngRef} type='text' required></input>
          </div>
        </div>
        <button type="submit">Salvar</button>
      </form>
    </aside>
  )
}