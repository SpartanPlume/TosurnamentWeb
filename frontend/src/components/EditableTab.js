import React from 'react';
import { Tabs, Tab, TabContent } from 'react-bootstrap';
import Field from "./Field";
import Select from "./Select";
import Button from "./Button";

function getValidRoles(all_roles) {
    return all_roles.filter((role) => (role.name !== "@everyone"));
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;
    return "rgb(" + [r, g, b].join(",") + ")";
}

class EditableTab extends React.Component {
    constructor(props) {
        super(props);
        var brackets = props.brackets !== undefined && props.brackets !== null ? props.brackets : [];
        var all_roles = props.roles !== undefined && props.roles !== null ? props.roles : [];
        brackets.push({name: "+"});
        this.state = {
            key: 1,
            brackets: brackets,
            all_roles: all_roles,
            roles: getValidRoles(all_roles)
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleTabTitleChange = this.handleTabTitleChange.bind(this);
        this.removeTab = this.removeTab.bind(this);
        this.onChange = props.onChange;
        this.onClickRemove = props.onClickRemove;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.brackets !== undefined && nextProps.brackets !== null &&
        nextProps.roles !== undefined && nextProps.roles !== null) {
            return {
                key: prevState.key,
                brackets: nextProps.brackets,
                all_roles: nextProps.roles,
                roles: getValidRoles(nextProps.roles)
            };
        }
        return null;
    }

    handleSelect(key) {
        if (key === this.state.brackets.length) {
            if (this.onChange === undefined) {
                return;
            }
            var promise = this.onChange(0, "", null, "");
            promise.then(response => response.json())
            .then(results => {var brackets = this.state.brackets; brackets[brackets.length - 1] = results; brackets.push({name: "+"}); this.setState({key: key, brackets: brackets});})
            .catch(error => {console.log("Error creating a bracket")});
        } else {
            this.setState({key: key, brackets: this.state.brackets, all_roles: this.state.all_roles, roles: this.state.roles});
        }
    }

    handleTabTitleChange(event) {
        var brackets = this.state.brackets;
        brackets[this.state.key - 1].name = event.target.value;
        this.setState({key: this.state.key, brackets: brackets, all_roles: this.state.all_roles, roles: this.state.roles});
    }

    handleBlur() {
        if (this.onChange !== undefined && arguments.length === 3) {
            var event = arguments[1];
            var new_value = arguments[2];
            this.onChange(this.state.brackets[this.state.key - 1].id, arguments[0], event, new_value);
        }
    }

    removeTab() {
        if (this.state.brackets.length > 2) {
            if (this.onClickRemove !== undefined) {
                this.onClickRemove(this.state.brackets[this.state.key - 1].id);
            }
            var brackets = this.state.brackets;
            var key = this.state.key;
            key -= 1;
            brackets.splice(key, 1);
            if (key >= brackets.length - 1) {
                key -= 1;
            }
            this.setState({key: key + 1, brackets: brackets, all_roles: this.state.all_roles, roles: this.state.roles});
        }
    }

    updateValue() {
        if (arguments.length === 4) {
            var array = arguments[1];
            if (this.onChange !== undefined && this.onChange !== null && array !== undefined && array !== null) {
                var event = arguments[2];
                var index = event.target.selectedIndex - 1;
                var value;
                if (index >= 0) {
                    value = array[index].id;
                } else {
                    value = null;
                }
                this.onChange(this.state.brackets[this.state.key - 1].id, arguments[0], event, value);
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
            bracket_name = (<Field name="Bracket name" value={this.state.brackets[i].name} onChange={this.handleTabTitleChange} onBlur={this.handleBlur.bind(this, "name")} />);
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
  
export default EditableTab;