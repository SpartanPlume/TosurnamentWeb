import React from 'react';
import Switch from "react-switch";

class SwitchButton extends React.Component {
    constructor(props) {
        super(props);
        var checked = props.checked !== undefined ? !!props.checked : false;
        this.state = {
            checked: checked
        };
        this.handleChange = this.handleChange.bind(this);
        this.onChange = props.onChange;
        this.placeholder = props.placeholder !== undefined ? props.placeholder : '';
    }
    
    handleChange(event) {
        if (this.onChange !== undefined) {
            this.onChange(event, !this.state.checked);
        }
        this.setState({checked: !this.state.checked});
    }
    
    render() {
        var name = "";
        var field_name = null;
        if (this.props.name !== undefined && this.props.name !== null) {
            name = this.props.name;
        }
        if (name !== "") {
            field_name = (<span className="field_name">{this.props.name}:</span>);
        }
        return (
            <div className="field_group">
                {field_name}
                <Switch
                    checked={this.state.checked}
                    onChange={this.handleChange}
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onColor="#abe6d5"
                    onHandleColor="#74d5b2"
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}/>
            </div>
        )
    }
};

export default SwitchButton;
