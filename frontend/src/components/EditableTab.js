import React from 'react';
import { Tabs, Tab, TabContent } from 'react-bootstrap';
import Field from "./Field";
import Select from "./Select";
import Button from "./Button";

class EditableTab extends React.Component {
    constructor(props) {
        super(props);
        var brackets = props.brackets !== undefined && props.brackets !== null ? props.brackets : [];
        brackets.push({name: "+"});
        this.state = {
            key: 1,
            brackets: brackets
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleTabTitleChange = this.handleTabTitleChange.bind(this);
        this.removeTab = this.removeTab.bind(this);
        this.onChange = props.onChange;
        this.onClickRemove = props.onClickRemove;
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
            this.setState({key: key, brackets: this.state.brackets});
        }
    }

    handleTabTitleChange(event) {
        var brackets = this.state.brackets;
        brackets[this.state.key - 1].name = event.target.value;
        this.setState({key: this.state.key, brackets: brackets});
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
            this.setState({key: key + 1, brackets: brackets});
        }
    }

    render() {
        var tabs = [];
        var bracket_name, bracket_role, players_spreadsheet, schedules_spreadsheet, challonge, delete_button;
        for (var i = 0; i < this.state.brackets.length; i++) {
            bracket_name = (<Field name="Bracket name" value={this.state.brackets[i].name} onChange={this.handleTabTitleChange} onBlur={this.handleBlur.bind(this, "name")} />);
            bracket_role = (<Select name="Bracket role" value="Default" options={["Default"]} />);
            players_spreadsheet = (<Button name="Players Spreadsheet" value="Modify" />);
            schedules_spreadsheet = (<Button name="Schedules Spreadsheet" value="Modify" />);
            challonge = (<Field name="Challonge" value={this.state.brackets[i].challonge} onBlur={this.handleBlur.bind(this, "challonge")} />);
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