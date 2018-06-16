import React from 'react';
import TextComponent from './TextComponent';

class Editable extends TextComponent {
    render() {
        return (
            <div className="field_group">
                <input id={this.state.valid ? this.state.id : this.state.id + "_error"} className="editable" type="text" value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} placeholder={this.state.placeholder} disabled={this.state.disabled}/>
            </div>
        )
    }
};

export default Editable;
