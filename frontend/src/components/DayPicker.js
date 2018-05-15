import React from 'react';
import PropTypes from 'prop-types';

class DayPicker extends React.Component {
    constructor(props) {
        super(props);
        var value = props.value ? props.value : "";
        this.initial_value = value;
        var values = value.split(' ', 2);
        var day = values[0];
        var time = values.length > 1 ? values[1] : "00:00";
        var checked = values.length > 1 ? true : false;
        this.state = {
            name: props.name,
            checked: checked,
            day: day,
            time: time,
            onChange: props.onChange
        };
        this.updateTime = this.updateTime.bind(this);
        this.updateDay = this.updateDay.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.options = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        var value = nextProps.value ? nextProps.value : "";
        var values = value.split(' ', 2);
        var day = values[0];
        var time = values.length > 1 ? values[1] : "00:00";
        var checked = values.length > 1 ? true : false;
        return {
            name: nextProps.name,
            checked: checked,
            day: day,
            time: time,
            onChange: nextProps.onChange
        };
    }
    
    updateTime(event) {
        this.setState({time: event.target.value});
    }
    
    updateDay(event) {
        this.handleChange(event, event.target.value);
        this.setState({day: event.target.value});
    }
    
    handleClick(event) {
        this.handleChange(event, this.state.day, !this.state.checked);
        this.setState({checked: !this.state.checked});
    }
    
    handleChange(event, day=this.state.day, checked=this.state.checked) {
        if (this.state.onChange) {
            var new_value;
            if (checked) {
                new_value = day + " " + this.state.time;
            } else {
                new_value = "";
            }
            if (this.initial_value !== new_value) {
                this.initial_value = new_value;
                this.state.onChange(event, this.initial_value);
            }
        }
    }
    
    render() {
        var rows = [];
        for (var i = 0; i < this.options.length; i++) {
            rows.push(<option key={this.options[i]} value={this.options[i]}>{this.options[i]}</option>)
        }
        var field_name = null;
        if (this.state.name && this.state.name !== "") {
            field_name = (<span className="field_name" style={{display: "block"}}>{this.state.name}:</span>);
        }
        return (
            <div>
                {field_name} <input className="checkbox" type="checkbox" onChange={this.handleClick} checked={this.state.checked}/> <React.Fragment><select className="select" onChange={this.updateDay} value={this.state.day} disabled={!this.state.checked}>{rows}</select><input className="field" type="time" value={this.state.time} onChange={this.updateTime} onBlur={this.handleChange} disabled={!this.state.checked}/></React.Fragment>
            </div>
        )
    }
};

DayPicker.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

DayPicker.defaultProps = {
    name: null,
    value: null,
    onChange: null
};

export default DayPicker;
