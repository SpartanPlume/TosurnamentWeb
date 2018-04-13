import React from 'react';
import Field from "./Field";
import CheckBox from "./CheckBox";
import SwitchButton from './SwitchButton';
import { PageHeader } from 'react-bootstrap';

class MainSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tournament: props.tournament
        };
        this.update = props.update;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.tournament !== undefined && nextProps.tournament !== null) {
            return {
                tournament: nextProps.tournament
            };
        }
        return null;
    }

    render() {
        if (this.state.tournament === undefined || this.state.tournament === null || this.update === undefined || this.update === null) {
            return (<div/>);
        }
        return (
            <div className="main_settings">
                <PageHeader bsClass="page_subheader"><small>Main settings</small></PageHeader>
                <Field name="Acronym" value={this.state.tournament.acronym} onBlur={this.update.bind(null, "acronym")} placeholder="Acronym" />
                <CheckBox name="Ping team" checked={this.state.tournament.ping_team} onClick={this.update.bind(null, "ping_team")} />
                <SwitchButton name="Name change enabled" checked={this.state.tournament.name_change_enabled} onChange={this.update.bind(null, "name_change_enabled")} />
            </div>
        );
    }
};

export default MainSettings;