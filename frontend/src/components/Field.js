import React from 'react';
import TextComponent from './TextComponent';

class Field extends TextComponent {
    render() {
        var field_name = null;
        if (this.state.name !== "") {
            field_name = (<div className="field_name" style={{display: "block"}}>{this.state.name}:</div>);
        }
        return (
            <div className="field_group">
                {field_name} <input className={this.state.valid ? "field" : "field_error"} type="text" value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} placeholder={this.state.placeholder}/>
            </div>
        )
    }
};

export default Field;
