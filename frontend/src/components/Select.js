import React from 'react';

class Select extends React.Component {
    constructor(props) {
        super(props);
        var value = props.value !== undefined && props.value !== null ? props.value : '';
        this.state = {
            value: value
        };
        this.handleChange = this.handleChange.bind(this);
        this.onChange = props.onChange;
        this.options = props.options !== undefined && props.options !== null ? props.options : [];
    }

    handleChange(event) {
        if (this.onChange !== undefined) {
            this.onChange(event, event.target.value);
        }
        this.setState({value: event.target.value});
    }

    render() {
        var rows = [];
        for (var i = 0; i < this.options.length; i++) {
            rows.push(<option key={this.options[i]} value={this.options[i]}>{this.options[i]}</option>)
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
                {field_name} <select className="select" onChange={this.handleChange} value={this.state.value}>{rows}</select>
            </div>
        )
    }
};
  
export default Select;