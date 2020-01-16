import React,{useEffect, useState} from 'react'
import './SideBar.css'
export const RegisterDev = ({getData}) => {
    const [long, setLong] = useState("")
    const [lat, setLat] = useState("")

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const {latitude, longitude} = position.coords
            setLat(latitude)
            setLong(longitude)
        }, 
        (err) => {
            console.log(err)
        },
        )
    }, [])

    const getFormData = (event) => {
        event.preventDefault()
        const arrayTechs = event.currentTarget.techs.value.split(',')
        const mapArray = arrayTechs.map( item => item.trim())
        const obj = {
        long,
        lat,
        techs: mapArray,
        github_username: event.currentTarget.user.value
    }
    getData(obj)
    }

    return(
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
                <input value={lat} type='text' required></input>
              </div>
              <div className="input-block">            
                <label>Longitude</label>
                <input type='text' value={long} required></input>
              </div>
            </div>
            <button type="submit">Salvar</button>
           </form>
        </aside>
    )
}