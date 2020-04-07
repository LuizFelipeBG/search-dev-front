import React from 'react'
import {deleteUser} from '../../service/registerAndInsertNewDev'
import './main.css'

export const DevList = React.memo(({allUsers, setAllUsers}) => {

    return (
        <main>
          <ul>
            {allUsers.map(({avatar_url, name, techs, bio, user_profile, _id}) =>(
              <li className="dev-item" key={_id}>
              <header>
                <img src={avatar_url} alt={name} />
                <div className="user-info">
                  <strong>{name}</strong>
                  <span>{techs.join(', ')}</span>
                </div>
              </header>
              <div className="button-div">
                <a href={user_profile}>Acessar Perfil do GitHub </a>
                <button className="remove-dev" onClick={() => deleteUser(_id,allUsers, setAllUsers)}>Remover</button>
              </div>
            </li>
            ))}
          </ul>
        </main>
    )
})