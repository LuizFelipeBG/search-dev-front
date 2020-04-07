import React from 'react';
import './header.css'

const style = {
    headerContainer:{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        padding: '7px',
    }

}
const Header = React.memo(({ shouldBeInRegisterPage, setshouldBeInRegisterPage }) => {

    return (
        <div style={style.headerContainer}>
            <button className="button-header"  onClick={() => setshouldBeInRegisterPage(currentValue => !currentValue)}>{shouldBeInRegisterPage ? 'PROCURAR POR TEC' : 'REGISTRAR DEV'}</button>
        </div>
    );
})

export default Header;
