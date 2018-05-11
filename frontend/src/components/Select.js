import React from 'react';

class Select extends React.Component {
    constructor(props) {
        super(props);
        var value = props.value !== undefined && props.value !== null ? props.value : '';
        var options = props.options !== undefined && props.options !== null ? props.options : [];
        this.state = {
            value: value,
            options: options,
            styles: props.styles !== undefined && props.styles !== null && props.styles.length === options.length ? props.styles : ([]).fill(null, 0, options.length),
            onChange: props.onChange
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.options !== undefined && nextProps.options !== null &&
            nextProps.value !== undefined && nextProps.value !== null) {            
            var styles = nextProps.styles !== undefined && nextProps.styles !== null && nextProps.styles.length === nextProps.options.length ? nextProps.styles : ([]).fill(null, 0, nextProps.options.length)
            return {
                value: nextProps.value,
                options: nextProps.options,
                styles: styles,
                onChange: nextProps.onChange
            }
        }
        return null;
    }
    
    handleChange(event) {
        if (this.state.onChange !== undefined) {
            this.state.onChange(event, event.target.value);
        }
        this.setState({value: event.target.value});
    }
    
    render() {
        var rows = [];
        for (var i = 0; i < this.state.options.length; i++) {
            rows.push(<option key={this.state.options[i]} value={this.state.options[i]} style={this.state.styles[i]}>{this.state.options[i]}</option>)
        }
        var name = "";
        var field_name = null;
        if (this.props.name !== undefined && this.props.name !== null) {
            name = this.props.name;
        }
        if (name !== "") {
            field_name = (<span className="field_name" style={{display: "block"}}>{this.props.name}:</span>);
        }
        return (
            <div className="field_group">
                {field_name} <select className="select" onChange={this.handleChange} value={this.state.value} style={this.state.styles[this.state.options.findIndex((option) => (option === this.state.value))]}>{rows}</select>
            </div>
        )
    }
};

export default Select;
