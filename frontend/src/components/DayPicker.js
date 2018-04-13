import React from 'react';

class DayPicker extends React.Component {
    constructor(props) {
        super(props);
        var value = props.value !== undefined && props.value !== null ? props.value : '';
        this.initial_value = value;
        var values = value.split(' ', 2);
        var day = values[0];
        var time = values.length > 1 ? values[1] : "00:00";
        var checked = values.length > 1 ? true : false;
        this.state = {
            checked: checked,
            day: day,
            time: time
        };
        this.updateTime = this.updateTime.bind(this);
        this.updateDay = this.updateDay.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChange = props.onChange;
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

    updateTime(event) {
        this.setState({checked: this.state.checked, day: this.state.day, time: event.target.value});
    }

    updateDay(event) {
        this.handleChange(event, event.target.value);
        this.setState({checked: this.state.checked, day: event.target.value, time: this.state.time});
    }

    handleClick(event) {
        this.handleChange(event, this.state.day, !this.state.checked);
        this.setState({checked: !this.state.checked, day: this.state.day, time: this.state.time});
    }

    handleChange(event, day=this.state.day, checked=this.state.checked) {
        if (this.onChange !== undefined) {
            var new_value;
            if (checked) {
                new_value = day + " " + this.state.time;
            } else {
                new_value = "";
            }
            if (this.initial_value !== new_value) {
                this.initial_value = new_value;
                this.onChange(event, this.initial_value);
            }
        }
    }

    render() {
        var rows = [];
        for (var i = 0; i < this.options.length; i++) {
            rows.push(<option key={this.options[i]} value={this.options[i]}>{this.options[i]}</option>)
        }
        var name = "";  
        var field_name = null;
        if (this.props.name !== undefined && this.props.name !== null) {
            name = this.props.name;
        }
        if (name !== "") {
            field_name = (<span className="field_name" style={{display: "block"}}>{this.props.name}:</span>);
        }
        return (
            <div>
                {field_name} <input className="checkbox" type="checkbox" onChange={this.handleClick} checked={this.state.checked}/> <React.Fragment><select className="select" onChange={this.updateDay} value={this.state.day} disabled={!this.state.checked}>{rows}</select><input className="field" type="time" value={this.state.time} onChange={this.updateTime} onBlur={this.handleChange} disabled={!this.state.checked}/></React.Fragment>
            </div>
        )
    }
};
  
export default DayPicker;