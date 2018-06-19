import React from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import Button from './Button';
import fetchApi from '../utils/fetchApi';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            session_token: props.session_token ? props.session_token : null,
            user: null
        };
        this.title = props.title ? props.title : "Tosurnament";
        this.revokeToken = this.revokeToken.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {        
        return {
            session_token: nextProps.session_token
        };
    }

    componentDidMount() {
        if (this.state.session_token && !this.state.user) {
            fetchApi("/v1/discord/users", { headers: { "Authorization": this.state.session_token } })
            .then(user => this.setState({user: user}))
            .catch(error => toast.error(error.message));
        }        
    }

    componentDidUpdate() {
        if (this.state.session_token && !this.state.user) {
            fetchApi("/v1/discord/users", { headers: { "Authorization": this.state.session_token } })
            .then(user => this.setState({user: user}))
            .catch(error => toast.error(error.message));
        }
    }

    revokeToken() {
        fetchApi("/v1/discord/tokens/revoke", {
            method: "POST",
            headers: {
                "Authorization": this.state.session_token
            }
        })
        .then(json => {localStorage.removeItem("session_token"); window.location = "/"})
        .catch(error => toast.error(error.message));
    }
    
    render() {
        var login_button;
        if (this.state.session_token) {
            if (this.state.user) {
                login_button = (<NavDropdown id="basic-nav-dropdown" eventKey={10} title={this.state.user.username}><MenuItem eventKey={10.1} onSelect={(event) => this.revokeToken()}>Disconnection</MenuItem></NavDropdown>);
            } else {
                login_button = (<NavDropdown id="basic-nav-dropdown" eventKey={10} title={""}><MenuItem eventKey={10.1} onSelect={(event) => this.revokeToken()}>Disconnection</MenuItem></NavDropdown>);
            }
        } else {
            login_button = (<Button id="login_button" value="Login with Discord" onClick={(event) => window.location="https://discordapp.com/api/oauth2/authorize?client_id=378433574602539019&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds"}/>);
        }
        return (
            <Navbar fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">{this.title}</a>
                        </Navbar.Brand>
                    <Navbar.Toggle/>
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
                        {login_button}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

Header.propTypes = {
    session_token: PropTypes.string,
    title: PropTypes.string
};

Header.defaultProps = {
    session_token: null
};

export default Header;
