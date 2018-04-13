import React from 'react';
import {Button, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.title = props.title !== undefined && props.title !== null ? props.title : "Tosurnament";
    }

    render() {
        return (
            <Navbar fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">{this.title}</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="/tournaments">
                            Tournaments
                        </NavItem>
                        <NavItem eventKey={2} href="/tournaments/115">
                            Test
                        </NavItem>
                        <NavDropdown eventKey={3} title="Tournaments Test" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1}>115</MenuItem>
                            <MenuItem eventKey={3.2}>Another action</MenuItem>
                            <MenuItem eventKey={3.3}>Something else here</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={3.4}>Separated link</MenuItem>
                        </NavDropdown>
                    </Nav>
                    <Nav pullRight>
                        <Button bsClass="login_button" onClick={(event) => window.location="https://discordapp.com/api/oauth2/authorize?client_id=378433574602539019&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=guilds%20identify"}>Login with Discord</Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header;