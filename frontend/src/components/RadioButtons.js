import React from 'react';
import PropTypes from 'prop-types';

class RadioButtons extends React.Component {
    constructor(props) {
        super(props);
        var options = props.options;
        var index = props.index;
        var value = options.find((option) => (props.value === option));
        if (index === null || index < -1 || index >= options.length) {
            index = -1;
            if (value !== undefined) {
                index = options.indexOf(value);
            }
        }
        this.state = {
            options: options,
            index: index
        };
        this.handleClick = this.handleClick.bind(this);
        this.onClick = props.onClick;
        this.placeholder = props.placeholder !== undefined ? props.placeholder : '';
    }
    
    handleClick(event) {
        var new_index = this.state.options.indexOf(event.target.value);
        if (this.onClick !== undefined) {
            this.onClick(event, new_index);
        }
        this.setState({ options: this.state.options, index: new_index });
    }
    
    render() {
        var field_name = null;
        if (this.props.name !== "") {
            field_name = (<span className="field_name" style={{display: "block"}}>{this.props.name}:</span>);
        }
        var buttons = [];
        var option;
        for (var i = 0; i < this.state.options.length; i++) {
            option = this.state.options[i];
            buttons.push(<div className="radio_button" key={i}><input className="radio" type="radio" id={option} name={this.props.name} value={option} onChange={this.handleClick} checked={i === this.state.index}/><label htmlFor={option} style={{marginLeft: "10px"}}>{option}</label></div>);
        }
        return (
            <div className="field_group">
                {field_name}
                <div className="radio_buttons">
                    {buttons}
                </div>
            </div>
        );
    }
};

RadioButtons.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    index: PropTypes.number,
    value: PropTypes.string
}

RadioButtons.defaultProps = {
    options: ["Choice"],
    index: null,
    value: "Choice"
}

export default RadioButtons;