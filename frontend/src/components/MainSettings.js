import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'react-bootstrap';
import TournamentSettings from './TournamentSettings';
import Field from './Field';
import SwitchButton from './SwitchButton';
import Select from './Select';

function getValidChannels(all_channels) {
    var channels = [];
    if (all_channels) {
        for (var i = 0; i < all_channels.length; i++) {
            if (all_channels[i].type === 0) {
                channels.push(all_channels[i]);
            }
        }
    }
    return channels;
}

function findChannelById(channel) {
    return channel.id === this.parent_id;
}

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

class MainSettings extends TournamentSettings {
    constructor(props) {
        super(props);
        this.state = {
            tournament: props.tournament,
            all_roles: props.roles,
            all_channels: props.channels,
            roles: getValidRoles(props.roles),
            channels: getValidChannels(props.channels)
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
                all_channels: nextProps.channels,
                channels: getValidChannels(nextProps.channels),
                roles: getValidRoles(nextProps.roles)
            };
        }
        return null;
    }
    
    render() {
        var formatted_channels = [""];
        var current_channel = "";
        for (var i = 0; i < this.state.channels.length; i++) {
            var channel_name = "#" + this.state.channels[i].name
            if (this.state.channels[i].parent_id !== undefined) {
                channel_name += " (" + this.state.all_channels.find(findChannelById, this.state.channels[i]).name + ")"
            }
            formatted_channels.push(channel_name);
            if (this.state.channels[i].id === this.state.tournament.staff_channel_id) {
                current_channel = channel_name;
            }
        }
        var formatted_roles = [""];
        var roles_styles = [{}];
        var current_roles = {};
        current_roles[this.state.tournament.admin_role_id] = "";
        current_roles[this.state.tournament.referee_role_id] = "";
        current_roles[this.state.tournament.streamer_role_id] = "";
        current_roles[this.state.tournament.commentator_role_id] = "";
        current_roles[this.state.tournament.player_role_id] = "";
        current_roles[this.state.tournament.team_captain_role_id] = "";
        for (i = 0; i < this.state.roles.length; i++) {
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
                <PageHeader bsClass="page_subheader"><small>Main settings</small></PageHeader>
                <Field name="Acronym" value={this.state.tournament.acronym} onBlur={this.update.bind(null, "acronym")} placeholder="Acronym" canBeEmpty={false}/>
                <Select name="Staff Channel" value={current_channel} options={formatted_channels} onChange={this.updateValue.bind(this, "staff_channel_id", this.state.channels)}/> 
                <Select name="Admin Role" value={current_roles[this.state.tournament.admin_role_id]} options={formatted_roles} styles={roles_styles} onChange={this.updateValue.bind(this, "admin_role_id", this.state.roles)}/>
                <Select name="Referee Role" value={current_roles[this.state.tournament.referee_role_id]} options={formatted_roles} styles={roles_styles} onChange={this.updateValue.bind(this, "referee_role_id", this.state.roles)}/>
                <Select name="Streamer Role" value={current_roles[this.state.tournament.streamer_role_id]} options={formatted_roles} styles={roles_styles} onChange={this.updateValue.bind(this, "streamer_role_id", this.state.roles)}/>
                <Select name="Commentator Role" value={current_roles[this.state.tournament.commentator_role_id]} options={formatted_roles} styles={roles_styles} onChange={this.updateValue.bind(this, "commentator_role_id", this.state.roles)}/>
                <Select name="Player Role" value={current_roles[this.state.tournament.player_role_id]} options={formatted_roles} styles={roles_styles} onChange={this.updateValue.bind(this, "player_role_id", this.state.roles)}/>
                <Select name="Team Captain Role" value={current_roles[this.state.tournament.team_captain_role_id]} options={formatted_roles} styles={roles_styles} onChange={this.updateValue.bind(this, "team_captain_role_id", this.state.roles)}/>
                <SwitchButton name="Enable name change" checked={!!this.state.tournament.name_change_enabled} onChange={this.update.bind(null, "name_change_enabled")}/>
            </div>
        );
    }
};

MainSettings.propTypes = {
	roles: PropTypes.arrayOf(PropTypes.object),
	channels: PropTypes.arrayOf(PropTypes.object)
};

MainSettings.defaultProps = {
    roles: [],
    channels: []
};

export default MainSettings;
