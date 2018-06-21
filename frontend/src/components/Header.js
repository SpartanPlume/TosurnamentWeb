import React from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {Navbar, Nav, NavDropdown, MenuItem, Image} from 'react-bootstrap';
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
                var title = (<div style={{display: "inline-block"}}><Image  style={{display: "inline-block", marginRight: "10px"}} responsive circle src={"https://cdn.discordapp.com/avatars/" + this.state.user.id + "/" + this.state.user.avatar + ".png?size=32"}/><span>{this.state.user.username}</span></div>);
                login_button = (<NavDropdown style={{paddingTop: "10px"}} id="user_dropdown" eventKey={10} title={title}><MenuItem eventKey={10.1} onSelect={(event) => this.revokeToken()}>Disconnection</MenuItem></NavDropdown>);
            } else {
                login_button = (<NavDropdown id="basic-nav-dropdown" eventKey={10} title={""}><MenuItem eventKey={10.1} onSelect={(event) => this.revokeToken()}>Disconnection</MenuItem></NavDropdown>);
            }
        } else {
            var protocol = window.location.protocol;
            if (!protocol) {
                protocol = "http:"
            }
            var redirect_uri = protocol + "//" + window.location.host + "/api/discord/callback&response_type=code&scope=identify guilds";
            redirect_uri = redirect_uri.replace(/\//g, "%2F");
            redirect_uri = redirect_uri.replace(/:/g, "%3A");
            redirect_uri = redirect_uri.replace(/ /g, "%20");
            login_button = (<Button id="login_button" value="Login with Discord" onClick={(event) => window.location = "https://discordapp.com/api/oauth2/authorize?client_id=378433574602539019&redirect_uri=" + redirect_uri}/>);
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
