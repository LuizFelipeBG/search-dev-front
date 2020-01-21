import React from 'react';

const style = {
    headerContainer:{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '7px'
    }

}
const Header = React.memo(({ shouldBeInRegisterPage, setshouldBeInRegisterPage }) => {

    return (
        <div style={style.headerContainer}>
            <button onClick={() => setshouldBeInRegisterPage(currentValue => !currentValue)}>{shouldBeInRegisterPage ? 'FILTRAR POR TEC' : 'REGISTRAR DEV'}</button>
        </div>
    );
})

export default Header;
