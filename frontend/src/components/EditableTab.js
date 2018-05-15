import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabContent } from 'react-bootstrap';
import Field from './Field';
import Select from './Select';
import Button from './Button';

function getValidRoles(all_roles) {
    return all_roles.filter((role) => (role.name !== "@everyone"));
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF;
    var g = (num & 0xFF00) >>> 8;
    var r = (num & 0xFF0000) >>> 16;
    return "rgb(" + [r, g, b].join(",") + ")";
}

class EditableTab extends React.Component {
    constructor(props) {
        super(props);
        var brackets = props.brackets ? props.brackets : [];
        var all_roles = props.roles ? props.roles : [];
        brackets.push({name: "+"});
        this.state = {
            key: 1,
            brackets: brackets,
            all_roles: all_roles,
            roles: getValidRoles(all_roles),
            onChange: props.onChange,
            onClickRemove: props.onClickRemove
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleTabTitleChange = this.handleTabTitleChange.bind(this);
        this.removeTab = this.removeTab.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.brackets) {
            return {
                key: prevState.key,
                brackets: nextProps.brackets,
                all_roles: nextProps.roles ? nextProps.roles: [],
                roles: getValidRoles(nextProps.roles),
                onChange: nextProps.onChange,
                onClickRemove: nextProps.onClickRemove
            };
        }
    }
    
    handleSelect(key) {
        if (key === this.state.brackets.length) {
            if (!this.state.onChange) {
                return;
            }
            var promise = this.state.onChange(0, "", null, "");
            promise.then(response => response.json())
            .then(results => {var brackets = this.state.brackets; brackets[brackets.length - 1] = results; brackets.push({name: "+"}); this.setState({key: key, brackets: brackets});})
            .catch(error => {console.log("Error creating a bracket")});
        } else {
            this.setState({key: key});
        }
    }
    
    handleTabTitleChange(value) {
        var brackets = this.state.brackets;
        brackets[this.state.key - 1].name = value;
        this.setState({brackets: brackets});
    }
    
    handleBlur() {
        if (this.state.onChange && arguments.length === 3) {
            var event = arguments[1];
            var new_value = arguments[2];
            var brackets = this.state.brackets;
            brackets[this.state.key - 1][arguments[0]] = new_value;
            this.state.onChange(this.state.brackets[this.state.key - 1].id, arguments[0], event, new_value);
            this.setState({brackets: brackets});
        }
    }
    
    removeTab() {
        if (this.state.brackets.length > 2) {
            if (this.state.onClickRemove) {
                this.state.onClickRemove(this.state.brackets[this.state.key - 1].id);
            }
            var brackets = this.state.brackets;
            var key = this.state.key;
            key -= 1;
            brackets.splice(key, 1);
            if (key >= brackets.length - 1) {
                key -= 1;
            }
            this.setState({key: key + 1, brackets: brackets});
        }
    }
    
    updateValue() {
        if (arguments.length === 4) {
            var array = arguments[1];
            if (this.state.onChange && array) {
                var event = arguments[2];
                var index = event.target.selectedIndex - 1;
                var value;
                if (index >= 0) {
                    value = array[index].id;
                } else {
                    value = null;
                }
                this.state.onChange(this.state.brackets[this.state.key - 1].id, arguments[0], event, value);
            }
        }
    }
    
    render() {
        var formatted_roles = [""];
        var roles_styles = [{}];
        var role_name;
        for (var i = 0; i < this.state.roles.length; i++) {
            role_name = "@" + this.state.roles[i].name;
            formatted_roles.push(role_name);
            if (this.state.roles[i].color !== undefined) {
                roles_styles.push({ color: toColor(this.state.roles[i].color) });
            }
        }
        var tabs = [];
        var bracket_name, bracket_role, players_spreadsheet, schedules_spreadsheet, challonge, delete_button;
        for (i = 0; i < this.state.brackets.length; i++) {
            var current_roles = {};
            current_roles[this.state.brackets[i].bracket_role_id] = "";
            for (var j = 0; j < this.state.roles.length; j++) {
                role_name = "@" + this.state.roles[j].name;
                if (this.state.roles[j].id in current_roles) {
                    current_roles[this.state.roles[j].id] = role_name;
                }
            }
            bracket_name = (<Field name="Bracket name" value={this.state.brackets[i].name} onChange={this.handleTabTitleChange} onBlur={this.handleBlur.bind(this, "name")} canBeEmpty={false} />);
            bracket_role = (<Select name="Bracket role" value={current_roles[this.state.brackets[i].bracket_role_id]} options={formatted_roles} styles={roles_styles} onChange={this.updateValue.bind(this, "bracket_role_id", this.state.roles)} />);
            players_spreadsheet = (<Button name="Players Spreadsheet" value="Modify" disabled={true} />);
            schedules_spreadsheet = (<Button name="Schedules Spreadsheet" value="Modify" disabled={true} />);
            challonge = (<Field name="Challonge" value={this.state.brackets[i].challonge} empty={true} onBlur={this.handleBlur.bind(this, "challonge")} />);
            delete_button = (<Button value="Delete this bracket" onClick={this.removeTab} />)
            tabs.push(<Tab key={i + 1} eventKey={i + 1} title={this.state.brackets[i].name}><TabContent bsClass="editable-tab" id={1}>{bracket_name}{bracket_role}{players_spreadsheet}{schedules_spreadsheet}{challonge}{delete_button}</TabContent></Tab>);
        }
        return (
            <div>
                <Tabs id={1} activeKey={this.state.key} onSelect={this.handleSelect}>{tabs}</Tabs>
            </div>
        )
    }
};

EditableTab.propTypes = {
    brackets: PropTypes.arrayOf(PropTypes.object).isRequired,
    roles: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    onClickRemove: PropTypes.func
};

EditableTab.defaultProps = {
    roles: [],
    onChange: null,
    onClickRemove: null
};

export default EditableTab;
