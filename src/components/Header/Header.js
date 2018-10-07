/**
 * Created by mpio on 26/10/16.
 */
import React from 'react'
import NavMenu from './NavMenu'
import { Menu } from 'semantic-ui-react'

const Header = () => {
    return (
        <Menu className="header" fixed="top">
            <NavMenu />
        </Menu>
    )
}

export default Header