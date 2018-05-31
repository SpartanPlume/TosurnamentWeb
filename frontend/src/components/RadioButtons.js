import React from 'react';
import PropTypes from 'prop-types';

class RadioButtons extends React.Component {
    constructor(props) {
        super(props);
        var options = props.options;
        var index = props.index;
        var value = options.find((option) => (props.value === option));
        if (index === undefined || index === null || index < -1 || index >= options.length) {
            index = -1;
            if (!value) {
                index = options.indexOf(value);
            }
        }
        this.state = {
            id: props.id,
            name: props.name,
            options: options,
            index: index,
            onClick: props.onClick
        };
        this.handleClick = this.handleClick.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.options) {
            var options = nextProps.options;
            var index = nextProps.index;
            var value = options.find((option) => (nextProps.value === option));
            if (index === undefined || index === null || index < -1 || index >= options.length) {
                index = -1;
                if (!value) {
                    index = options.indexOf(value);
                }
            }
            return {
                id: nextProps.id,
                name: nextProps.name,
                options: options,
                index: index,
                onClick: nextProps.onClick
            }
        }
    }
    
    handleClick(event) {
        var new_index = this.state.options.indexOf(event.target.value);
        if (this.state.onClick) {
            this.state.onClick(event, new_index);
        }
        this.setState({ index: new_index });
    }
    
    render() {
        var field_name = null;
        if (this.state.name !== "") {
            field_name = (<span className="field_name" style={{display: "block"}}>{this.state.name}:</span>);
        }
        var buttons = [];
        var option;
        for (var i = 0; i < this.state.options.length; i++) {
            option = this.state.options[i];
            buttons.push(<div className="radio_button" key={i}><input className="radio" type="radio" id={option} name={this.state.name} value={option} onChange={this.handleClick} checked={i === this.state.index}/><label htmlFor={option} style={{marginLeft: "10px"}}>{option}</label></div>);
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
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    index: PropTypes.number,
    value: PropTypes.string
};

RadioButtons.defaultProps = {
    id: null,
    index: null,
    value: null
};

export default RadioButtons;