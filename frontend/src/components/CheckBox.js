import React from 'react';

class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        var checked = props.checked !== undefined ? !!props.checked : false;
        this.state = {
            checked: checked
        };
        this.handleClick = this.handleClick.bind(this);
        this.onClick = props.onClick;
        this.placeholder = props.placeholder !== undefined ? props.placeholder : '';
    }

    handleClick(event) {
        if (this.onClick !== undefined) {
            this.onClick(event, !this.state.checked);
        }
        this.setState({checked: !this.state.checked});
    }

    render() {
        return (
            <div className="field_group">
                <span className="field_name">{this.props.name}:</span> <input className="checkbox" type="checkbox" onChange={this.handleClick} checked={this.state.checked}/>
            </div>
        )
    }
};
  
export default CheckBox;