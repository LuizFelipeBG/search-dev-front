import React from 'react'
import './main.css'

export const DevList = React.memo(({allUsers}) => {
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
              <p>{bio}</p>
              <a href={user_profile}>Acessar Perfil do GitHub </a>
            </li>
            ))}
          </ul>
        </main>
    )
})