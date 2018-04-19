import React from 'react';

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.id !== undefined ? props.id : null;
        this.value = props.value !== undefined && props.value !== null ? props.value : '';
        this.alone = props.alone !== undefined && props.alone !== null ? props.alone : true;
        this.disabled = props.disabled !== undefined && props.disabled !== null ? props.disabled : false;
        this.handleClick = this.handleClick.bind(this);
        this.onClick = props.onClick;
    }

    handleClick(event) {
        if (this.onClick !== undefined) {
            this.onClick(event);
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
        if (this.alone) {
            return (
                <div className="field_group">
                    {field_name} <button className="button" type="button" onClick={this.handleClick} disabled={this.disabled}>{this.value}</button>
                </div>
            );
        } else {
            return (
                <React.Fragment>
                    {field_name} <button id={this.id} className="button" type="button" onClick={this.handleClick} disabled={this.disabled}>{this.value}</button>
                </React.Fragment>
            );
        }
    }
};
  
export default Button;