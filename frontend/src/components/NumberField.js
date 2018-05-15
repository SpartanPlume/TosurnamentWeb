import React from 'react';
import TextComponent from './TextComponent';

class NumberField extends TextComponent {
	constructor(props) {
		super(props);
        this.handleChange = this.handleChange.bind(this);
	}

    handleChange(event) {
        var value = event.target.value.replace(/\D/g,'');
        var valid = true;
        if (value === "") {
            valid = false;
        }
        if (this.onChange) {
            this.onChange(event);
        }
        this.setState({value: value, valid: valid});
    }
    
    render() {
        var field_name = null;
        if (this.state.name && this.state.name !== "") {
            field_name = (<span className="field_name" style={{display: "block"}}>{this.state.name}:</span>);
        }
        return (
            <div className="field_group">
                {field_name} <input className={this.state.valid ? "number_field" : "number_field_error"} type="text" value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} placeholder={this.state.placeholder}/>
            </div>
        )
    }
};

export default NumberField;
