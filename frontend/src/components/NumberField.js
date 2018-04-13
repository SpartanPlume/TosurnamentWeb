import React from 'react';

class NumberField extends React.Component {
    constructor(props) {
        super(props);
        var default_value = props.value !== undefined && props.value !== null ? props.value : 0;
        this.initial_value = default_value;
        this.state = {
            valid: true,
            value: default_value
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.onBlur = props.onBlur;
        this.placeholder = props.placeholder !== undefined ? props.placeholder : '';
    }

    handleChange(event) {
        var value = event.target.value.replace(/\D/g,'');
        var valid = true;
        if (value === "") {
            valid = false;
        }
        if (this.onChange !== undefined) {
            this.onChange(event);
        }
        this.setState({valid: valid, value: value});
    }

    handleBlur(event) {
        if (this.onBlur !== undefined) {
            if (this.state.valid && this.initial_value !== this.state.value) {
                this.initial_value = this.state.value;
                this.onBlur(event, this.initial_value);
            } else if (this.initial_value !== this.state.value) {
                this.setState({valid: true, value: this.initial_value});
            }
        }
    }

    render() {
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
                {field_name} <input className={this.state.valid ? "number_field" : "number_field_error"} type="text" value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} placeholder={this.placeholder}/>
            </div>
        )
    }
};

export default NumberField;