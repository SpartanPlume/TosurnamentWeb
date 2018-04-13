import React from 'react';
import EditableTab from "./EditableTab";
import { PageHeader } from 'react-bootstrap';

class BracketsSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tournament: props.tournament
        };
        this.update = props.update;
        this.delete = props.delete;
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
            <div className="brackets_settings">
                <PageHeader bsClass="page_subheader"><small>Bracket settings</small></PageHeader>
                <EditableTab brackets={this.state.tournament.brackets} onChange={this.update} onClickRemove={this.delete} />
            </div>
        );
    }
};

export default BracketsSettings;