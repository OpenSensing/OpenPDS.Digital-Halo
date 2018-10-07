/**
 * Created by mpio on 26/10/16.
 */
/* global chrome */
import React from 'react'
import MenuItem from './MenuItem'
import Logo from './Logo'
import logoImg from '../../../public/pics/icon-16.png'
import { Container, Menu } from 'semantic-ui-react'

const NavMenu = ({links}) => {
    const onLinkClick = (id) => {alert(id)}
    links  = links ||[ {target: 'Digital Halo', href:'digitalhalo.org/', children: [<Logo source={logoImg} key={0} alt="Logo"/>],
            onClick: ()=> chrome.tabs.create({url: "digitalhalo.org/"})},
            {target:'DTL', href:'https://datatransparencylab.org/dtl-2015/grantees-2015/',
                onClick: ()=> chrome.tabs.create({url: "https://datatransparencylab.org/dtl-2015/grantees-2015/"})}//,
            //{target: 'second', href: '', onClick: onLinkClick}
        ]
    const MenuItems   = links.map((link) => <MenuItem link={link} key={link.target}/>)
    
    return (
        <Container className="navList">
            {MenuItems}
        </Container>
    )
}


export default NavMenu