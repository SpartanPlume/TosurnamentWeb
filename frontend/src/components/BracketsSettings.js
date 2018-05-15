import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'react-bootstrap';
import TournamentSettings from './TournamentSettings';
import EditableTab from './EditableTab';

class BracketsSettings extends TournamentSettings {
	constructor(props) {
		super(props);
		this.state = {
			tournament: props.tournament,
			roles: props.roles
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.tournament) {
			return {
				tournament: nextProps.tournament,
				roles: nextProps.roles
			};
		}
	}

	render() {
		if (!this.state.tournament || !this.update) {
			return (<div/>);
		}
		return (
			<div className="brackets_settings">
				<PageHeader bsClass="page_subheader"><small>Bracket settings</small></PageHeader>
				<EditableTab brackets={this.state.tournament.brackets} roles={this.state.roles} onChange={this.update} onClickRemove={this.delete}/>
			</div>
		);
	}
};

BracketsSettings.propTypes = {
	roles: PropTypes.arrayOf(PropTypes.object),
};

BracketsSettings.defaultProps = {
	roles: []
};

export default BracketsSettings;
