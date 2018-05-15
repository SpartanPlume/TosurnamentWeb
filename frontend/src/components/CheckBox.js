import React from 'react';
import PropTypes from 'prop-types';

class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: props.name,
            checked: props.checked !== undefined && props.checked !== null ? props.checked : false,
            onClick: props.onClick
        };
        this.handleClick = this.handleClick.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            id: nextProps.id,
            name: nextProps.name,
            checked: nextProps.checked !== undefined && nextProps.checked !== null ? !!nextProps.checked : false,
            onClick: nextProps.onClick
        }
    }
    
    handleClick(event) {
        if (this.state.onClick) {
            this.state.onClick(event, !this.state.checked);
        }
        this.setState({checked: !this.state.checked});
    }
    
    render() {
        if (this.state.name && this.state.name !== "") {
            field_name = (<span className="field_name" style={{display: "block"}}>{this.state.name}:</span>);
        }
        return (
            <div className="field_group">
                {field_name} <input className="checkbox" type="checkbox" onChange={this.handleClick} checked={this.state.checked}/>
            </div>
        )
    }
};

CheckBox.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func
};

CheckBox.defaultProps = {
    id: null,
    name: null,
    checked: null,
    onClick: null
};

export default CheckBox;
