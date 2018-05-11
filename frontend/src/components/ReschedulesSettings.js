import React from 'react';
import NumberField from "./NumberField";
import DayPicker from "./DayPicker";
import RadioButtons from "./RadioButtons";
import { PageHeader } from 'react-bootstrap';

class ReschedulesSettings extends React.Component {
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
    
    updateBooleanFromIndex() {
        if (arguments.length === 3) {
            if (this.update !== undefined && this.update !== null) {
                var event = arguments[1];
                var index = arguments[2];
                var value;
                if (index === 1) {
                    value = true;
                } else {
                    value = false;
                }
                this.update(arguments[0], event, value);
            }
        }
    }
    
    render() {
        if (this.state.tournament === undefined || this.state.tournament === null || this.update === undefined || this.update === null) {
            return (<div/>);
        }
        return (
            <div className="reschedules_settings">
                <PageHeader bsClass="page_subheader"><small>Reschedules settings</small></PageHeader>
                <RadioButtons name="Ping team" options={["Ping only the team captain of a team", "Ping team role"]} index={+ this.state.tournament.ping_team} onClick={this.updateBooleanFromIndex.bind(this, "ping_team")}/>
                <NumberField name="Hours before match" value={this.state.tournament.reschedule_hours_deadline} onBlur={this.update.bind(null, "reschedule_hours_deadline")}/>
                <DayPicker name="Reschedule Range Begin" value={this.state.tournament.reschedule_range_begin} onChange={this.update.bind(null, "reschedule_range_begin")}/>
                <DayPicker name="Reschedule Range End" value={this.state.tournament.reschedule_range_end} onChange={this.update.bind(null, "reschedule_range_end")}/>
            </div>
        );
    }
};

export default ReschedulesSettings;
