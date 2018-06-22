import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import qs from 'qs';
import fetchApi from '../utils/fetchApi';
import Home from './Home';
import Tournament from './Tournament';

class Body extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			session_token: props.session_token ? props.session_token : null,
			guilds: []
		};
		this.discordCallback = this.discordCallback.bind(this);
		if (this.state.session_token) {
			this.fetchGuilds(props.session_token);
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState) {
			return {session_token: nextProps.session_token, guilds: prevState.guilds};
		} else {
			return {session_token: nextProps.session_token, guilds: []};
		}
	}

	fetchGuilds(session_token) {
		fetchApi("/v1/discord/common/guilds", {
			headers: {
				'Authorization': session_token
			}
		})
		.then(results => {var guilds = Object.keys(results).length === 0 ? [] : results; this.setState({session_token: session_token, guilds: guilds});})
		.catch(error => toast.error(error.message))
	}

	discordCallback(props) {
		const formData = qs.parse(props.location.search.substr(1));
		console.log(props.location.search);
		if (this.state.session_token) {
			formData["session_token"] = this.state.session_token;
		}
		fetchApi("/v1/discord/tokens", {
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
		.then(results => {localStorage.setItem('session_token', results.session_token); this.fetchGuilds(results.session_token); this.props.history.push("/")})
		.catch(error => toast.error(error.message))
		return (<Redirect to="/loading"/>);
	}

	render() {
		return (
			<div id="body">
				<Route exact path="/" render={(props) => {return (<Home guilds={this.state.guilds} {...props}/>);}}/>
				<Route exact path="/loading" component={Loading}/>
				<Route path="/guilds/:number" render={(props) => {let guild = this.state.guilds.find((guild) => guild.id === props.match.params.number); return (!guild ? null : <Tournament session_token={this.state.session_token} guild={guild} {...props}/>);}}/>
				<Route path="/api/discord/callback" render={(props) => {return this.discordCallback(props)}}/>
			</div>
		);
	}
}

class Loading extends React.Component {
	render() {
		return (<span>Loading</span>);
	}
}

Body.propTypes = {
	session_token: PropTypes.string
};

Body.defaultProps = {
	session_token: null
};

export default withRouter(Body);
