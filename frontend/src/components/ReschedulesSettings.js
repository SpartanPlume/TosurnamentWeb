import React from 'react';
import { PageHeader } from 'react-bootstrap';
import TournamentSettings from './TournamentSettings';
import NumberField from './NumberField';
import DayPicker from './DayPicker';
import RadioButtons from './RadioButtons';

class ReschedulesSettings extends TournamentSettings {
    updateBooleanFromIndex() {
        if (arguments.length === 3) {
            if (this.update) {
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
        if (!this.state.tournament || !this.update) {
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
