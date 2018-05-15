import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';

class SwitchButton extends React.Component {
    constructor(props) {
        super(props);
        var checked = props.checked !== undefined && props.checked !== null ? props.checked : false;
        this.state = {
            id: props.id,
            name: props.name,
            checked: checked,
            onChange: props.onChange
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
        if (this.state.onChange) {
            this.state.onChange(event, !this.state.checked);
        }
        this.setState({checked: !this.state.checked});
    }
    
    render() {
        var field_name = null;
        if (this.state.name && this.state.name !== "") {
            field_name = (<span className="field_name">{this.state.name}:</span>);
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

SwitchButton.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

SwitchButton.defaultProps = {
    id: null,
    name: null,
    checked: null,
    onChange: null
};

export default SwitchButton;
