import React from 'react';
import TextArea from "./TextArea";
import { PageHeader } from 'react-bootstrap';

class PostResultSettings extends React.Component {
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
            <div className="post_result_settings">
                <PageHeader bsClass="page_subheader"><small>Post result settings</small></PageHeader>
                <TextArea name="Post result message" value={this.state.tournament.post_result_message} onBlur={this.update.bind(null, "post_result_message")} />
            </div>
        );
    }
};

export default PostResultSettings;