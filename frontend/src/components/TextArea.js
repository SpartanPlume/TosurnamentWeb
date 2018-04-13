import React from 'react';

class TextArea extends React.Component {
    constructor(props) {
        super(props);
        var default_value = props.value !== undefined && props.value !== null ? props.value : '';
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
        this.setState({valid: true, value: event.target.value});
    }

    handleBlur(event) {
        if (this.onBlur !== undefined && this.state.valid) {
            if (this.initial_value !== this.state.value) {
                this.initial_value = this.state.value;
                this.onBlur(event, this.initial_value);
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
            field_name = (<div className="field_name" style={{display: "block"}}>{this.props.name}:</div>);
        }
        return (
            <div className="field_group">
                {field_name}<textarea className="textarea" value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} placeholder={this.placeholder}/>
            </div>
        )
    }
};
  
export default TextArea;