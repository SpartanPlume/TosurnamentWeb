import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'react-bootstrap';
import TournamentSettings from './TournamentSettings';
import Field from './Field';
import Select from './Select';

function getValidRoles(all_roles) {
    if (all_roles) {
        return all_roles.filter((role) => (role.name !== "@everyone"));
    } else {
        return [];
    }
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF;
    var g = (num & 0xFF00) >>> 8;
    var r = (num & 0xFF0000) >>> 16;
    return "rgb(" + [r, g, b].join(",") + ")";
}

class OwnerOnlySettings extends TournamentSettings {
	constructor(props) {
        super(props);
        this.state = {
            tournament: props.tournament,
            all_roles: props.roles,
            roles: getValidRoles(props.roles)
        };
	}
	
	updateValue() {
        if (arguments.length === 4) {
            var array = arguments[1];
            if (this.update) {
                var event = arguments[2];
                var index = event.target.selectedIndex - 1;
                var value;
                if (index >= 0) {
                    value = array[index].id;
                } else {
                    value = null;
                }
                this.update(arguments[0], event, value);
            }
        }
	}
	
	static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.tournament) {
            return {
                tournament: nextProps.tournament,
                all_roles: nextProps.roles,
                roles: getValidRoles(nextProps.roles)
            };
        }
        return null;
    }

	render() {
		var formatted_roles = [""];
        var roles_styles = [{}];
        var current_roles = {};
        current_roles[this.state.tournament.admin_role_id] = "";
        current_roles[this.state.tournament.referee_role_id] = "";
        current_roles[this.state.tournament.streamer_role_id] = "";
        current_roles[this.state.tournament.commentator_role_id] = "";
        current_roles[this.state.tournament.player_role_id] = "";
        current_roles[this.state.tournament.team_captain_role_id] = "";
        for (var i = 0; i < this.state.roles.length; i++) {
            var role_name = "@" + this.state.roles[i].name;
            formatted_roles.push(role_name);
            if (this.state.roles[i].color !== undefined) {
                roles_styles.push({ color: toColor(this.state.roles[i].color) });
            }
            if (this.state.roles[i].id in current_roles) {
                current_roles[this.state.roles[i].id] = role_name;
            }
        }
        if (!this.state.tournament || !this.update) {
            return (<div/>);
        }
        return (
            <div className="main_settings">
                <PageHeader bsClass="page_subheader"><small>Owner-Only settings</small></PageHeader>
                <Field name="Acronym" value={this.state.tournament.acronym} onBlur={this.update.bind(null, "acronym")} placeholder="Acronym" canBeEmpty={false}/>
                <Select name="Admin Role" value={current_roles[this.state.tournament.admin_role_id]} options={formatted_roles} styles={roles_styles} onChange={this.updateValue.bind(this, "admin_role_id", this.state.roles)}/>
			</div>
        );
    }
};

OwnerOnlySettings.propTypes = {
	roles: PropTypes.arrayOf(PropTypes.object)
};

OwnerOnlySettings.defaultProps = {
    roles: []
};

export default OwnerOnlySettings;
