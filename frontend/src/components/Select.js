import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.Component {
    constructor(props) {
        super(props);
        var value = props.value ? props.value : "";
        var options = props.options ? props.options : [];
        this.state = {
            id: props.id,
            name: props.name,
            value: value,
            options: options,
            styles: props.styles && props.styles.length === options.length ? props.styles : ([]).fill(null, 0, options.length),
            onChange: props.onChange
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.options) {            
            var styles = nextProps.styles && nextProps.styles.length === nextProps.options.length ? nextProps.styles : ([]).fill(null, 0, nextProps.options.length)
            return {
                id: nextProps.id,
                name: nextProps.name,
                value: nextProps.value ? nextProps.value : "",
                options: nextProps.options,
                styles: styles,
                onChange: nextProps.onChange
            }
        }
    }
    
    handleChange(event) {
        if (this.state.onChange) {
            this.state.onChange(event, event.target.value);
        }
        this.setState({value: event.target.value});
    }
    
    render() {
        var rows = [];
        for (var i = 0; i < this.state.options.length; i++) {
            rows.push(<option key={this.state.options[i]} value={this.state.options[i]} style={this.state.styles[i]}>{this.state.options[i]}</option>)
        }
        var field_name = null;
        if (this.state.name && this.state.name !== "") {
            field_name = (<span className="field_name" style={{display: "block"}}>{this.state.name}:</span>);
        }
        return (
            <div className="field_group">
                {field_name} <select className="select" onChange={this.handleChange} value={this.state.value} style={this.state.styles[this.state.options.findIndex((option) => (option === this.state.value))]}>{rows}</select>
            </div>
        )
    }
};

Select.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string,
    styles: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
};

Select.defaultProps = {
    id: null,
    name: null,
    value: null,
    styles: [],
    onChange: null
};

export default Select;
