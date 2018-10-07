/**
 * Created by mpio on 26/10/16.
 */
import React, {PropTypes} from 'react'
import { Menu } from 'semantic-ui-react'


const MenuItem = ({link}) => (
  <Menu.Item as="a" href={link.href} onClick={(e) => {e.preventDefault();link.onClick(link.target)}}>
	  {link.children && link.children}
      {link.target && link.target}
  </Menu.Item>
)


MenuItem.propTypes = {
    link: PropTypes.object.isRequired,
}

export default MenuItem