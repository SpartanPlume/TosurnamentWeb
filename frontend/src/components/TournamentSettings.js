import React from 'react';
import PropTypes from 'prop-types';

class TournamentSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tournament: props.tournament
        };
        this.update = props.update;
		this.delete = props.delete;
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.tournament) {
            return {
                tournament: nextProps.tournament
            };
        }
    }
};

TournamentSettings.propTypes = {
	tournament: PropTypes.object.isRequired,
	update: PropTypes.func.isRequired,
	delete: PropTypes.func
};

TournamentSettings.defaultProps = {
	delete: null
};

export default TournamentSettings;
