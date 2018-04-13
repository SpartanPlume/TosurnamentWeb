import React from 'react';
import NumberField from "./NumberField";
import DayPicker from "./DayPicker";
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

    render() {
        if (this.state.tournament === undefined || this.state.tournament === null || this.update === undefined || this.update === null) {
            return (<div/>);
        }
        return (
            <div className="reschedules_settings">
                <PageHeader bsClass="page_subheader"><small>Reschedules settings</small></PageHeader>
                <NumberField name="Hours before match" value={this.state.tournament.reschedule_hours_deadline} onBlur={this.update.bind(null, "reschedule_hours_deadline")} />
                <DayPicker name="Reschedule Range Begin" value={this.state.tournament.reschedule_range_begin} onChange={this.update.bind(null, "reschedule_range_begin")} />
            </div>
        );
    }
};

export default ReschedulesSettings;