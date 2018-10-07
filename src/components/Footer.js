/**
 * Created by mpio on 26/10/16.
 */
/* global chrome */
import React from 'react';
import PropTypes from 'prop-types';
import {
	Container,
	Grid,
	Header,
	List,
	Segment
} from 'semantic-ui-react'

const Footer = ({aboutLinks}) => {
    let aboutLinkElements = aboutLinks.map((l) =>
        <List.Item as="a" href={l.href} style={{display: "inline-block", "margin-right": "20px"}}
				   className="footerLink" key={l.target}
				   onClick={(e)=> {e.preventDefault();chrome.tabs.create({url: l.url})}}>
			{l.target}
		</List.Item>);

	return (


	<Segment vertical style={{ padding: '0.5em 0em' }}>
	<Container>
	    <Grid divided stackable>
			<Grid.Column width={3}>
				<Header  as='h5' content='About' />
				<List link >
					{aboutLinkElements}
				</List>
			</Grid.Column>
	    </Grid>
	</Container>
	</Segment>
    )
}

Footer.propTypes = {
    links: PropTypes.array.isRequired
}

export default Footer
