import React from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import fetchApi from '../utils/fetchApi';
import Editable from './Editable';
import OwnerOnlySettings from './OwnerOnlySettings';
import MainSettings from './MainSettings';
import BracketsSettings from './BracketsSettings';
import ReschedulesSettings from './ReschedulesSettings';
import PostResultSettings from './PostResultsSettings';

class Tournament extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tournament: null,
			guild: props.guild !== undefined ? props.guild : null,
			roles: null,
			channels: null
		};
		this.fetchData = this.fetchData.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState) {
			return {
				tournament: prevState.tournament,
				guild: nextProps.guild,
				roles: prevState.roles,
				channels: prevState.channels
			};
		} else {
			return {
				tournament: null,
				guild: nextProps.guild,
				roles: null,
				channels: null
			};
		}
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		if (this.state.guild && !this.state.tournament) {
			fetchApi("/v1/tosurnament/tournaments?server_id=" + this.state.guild.id, { headers: { "Authorization": this.props.session_token } })
			.then(tournaments => tournaments[0] ? this.setState({ tournament: tournaments[0] }) : toast.error("No tournament running, create one before using the web interface."))
			.catch(error => toast.error(error.message))
		}
		if (this.state.guild && this.props.session_token && (this.state.roles === null || this.state.channels === null)) {
			Promise.all([
				fetchApi("/v1/discord/guilds/" + this.state.guild.id + "/roles", { headers: { "Authorization": this.props.session_token } }),
				fetchApi("/v1/discord/guilds/" + this.state.guild.id + "/channels", { headers: { "Authorization": this.props.session_token } })
			])
			.then(([roles, channels]) => {this.setState({ tournament: this.state.tournament, guild: this.state.guild, roles: roles, channels: channels})})
			.catch(error => toast.error(error.message));
		}
	}
	
	updateTournament() {
		if (arguments.length === 3) {
			//var event = arguments[1];
			var value = arguments[2];
			if (this.state.tournament !== undefined) {
				let toast_id = toast.info("Saving changes...");
				const formData = {};
				formData[arguments[0]] = value;
				fetchApi("/v1/tosurnament/tournaments/" + this.state.tournament.id, {
					method: "PUT",
					headers: {
						'Content-type': 'application/json'
					},
					body: JSON.stringify(formData)
				})
				.then(results => {toast.dismiss(toast_id); toast.success("Success!")})
				.catch(error => {toast.dismiss(toast_id); toast.error(error.message)});
			}
		}
	}

	updateBracket() {
		if (arguments.length === 4) {
			var bracket_id = arguments[0];
			//var event = arguments[2];
			var value = arguments[3];
			if (this.state.tournament !== undefined) {
				if (parseInt(bracket_id, 10) > 0) {
					let toast_id = toast.info("Saving changes...");
					const formData = {};
					formData[arguments[1]] = value;
					fetchApi("/v1/tosurnament/tournaments/" + this.state.tournament.id + "/brackets/" + bracket_id, {
						method: "PUT",
						headers: {
							'Content-type': 'application/json'
						},
						body: JSON.stringify(formData)
					})
					.then(results => {toast.dismiss(toast_id); toast.success("Success!")})
					.catch(error => {toast.dismiss(toast_id); toast.error(error.message)});
				} else {
					let toast_id = toast.info("Creating a new bracket...");
					const formData = {};
					formData["name"] = "New bracket";
					formData["tournament_id"] = this.state.tournament.id;
					return new Promise((resolve, reject) => {
						fetchApi("/v1/tosurnament/tournaments/" + this.state.tournament.id + "/brackets", {
							method: "POST",
							headers: {
								'Content-type': 'application/json'
							},
							body: JSON.stringify(formData)
						})
						.then(results => {toast.dismiss(toast_id); toast.success("Success!"); resolve(results)})
						.catch(error => {toast.dismiss(toast_id); toast.error("Error creating a bracket"); reject(error)});
					});
				}
			}
		}
	}

	deleteBracket() {
		if (arguments.length === 1) {
			var bracket_id = arguments[0];
			if (this.state.tournament !== undefined) {
				let toast_id = toast.info("Deleting bracket...");
				fetchApi("/v1/tosurnament/tournaments/" + this.state.tournament.id + "/brackets/" + bracket_id, {
					method: "DELETE"
				})
				.then(results => {toast.dismiss(toast_id); toast.success("Success!")})
				.catch(error => {toast.dismiss(toast_id); toast.error(error.message)});
			}
		}
	}

	render() {
		if (!this.state.tournament || (Object.keys(this.state.tournament).length === 0 && this.state.tournament.constructor === Object)) {
			return (<div/>);
		}
		let name_field = null;
		let owner_field = null;
		if (this.state.guild.owner) {
			name_field = (<Editable id="tournament_name" value={this.state.tournament.name} onBlur={this.updateTournament.bind(this, "name")} placeholder="My Tournament" canBeEmpty={false}/>);
			owner_field = (<OwnerOnlySettings tournament={this.state.tournament} roles={this.state.roles}update={this.updateTournament.bind(this)}/>);
		} else {
			name_field = (<div id="tournament_name">{this.state.tournament.name}</div>);
		}
		return (
			<div>
				{name_field}
				{owner_field}
				<MainSettings tournament={this.state.tournament} channels={this.state.channels} roles={this.state.roles} update={this.updateTournament.bind(this)}/>
				<BracketsSettings tournament={this.state.tournament} roles={this.state.roles} update={this.updateBracket.bind(this)} delete={this.deleteBracket.bind(this)}/>
				<ReschedulesSettings tournament={this.state.tournament} update={this.updateTournament.bind(this)}/>
				<PostResultSettings tournament={this.state.tournament} update={this.updateTournament.bind(this)}/>        
			</div>
		);
	}
};

Tournament.propTypes = {
	session_token: PropTypes.string,
	guild: PropTypes.object.isRequired
};

Tournament.defaultProps = {
	session_token: null
};

export default Tournament;
