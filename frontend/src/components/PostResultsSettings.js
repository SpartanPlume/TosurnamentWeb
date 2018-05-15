import React from 'react';
import { PageHeader } from 'react-bootstrap';
import TournamentSettings from './TournamentSettings';
import TextArea from './TextArea';

class PostResultSettings extends TournamentSettings {
    render() {
        if (!this.state.tournament || !this.update) {
            return (<div/>);
        }
        return (
            <div className="post_result_settings">
                <PageHeader bsClass="page_subheader"><small>Post result settings</small></PageHeader>
                <TextArea name="Post result message" value={this.state.tournament.post_result_message} onBlur={this.update.bind(null, "post_result_message")}/>
            </div>
        );
    }
};

export default PostResultSettings;
