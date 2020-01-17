import React from 'react'
import Logo from '../../assets/img/gerdau-logo.png'

export default props => {
    return (
        <div className="component">
            <div className="img">
                <img
                    className="mb-4"
                    alt="Logo"
                    src={Logo}
                    width="300"
                />
            </div>
            <div className="container">
                {props.children}
            </div>
        </div>
    )
}
