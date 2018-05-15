import React from 'react';
import PropTypes from 'prop-types';

class TextComponent extends React.Component {
	constructor(props) {
		super(props);
        var default_value = props.value ? props.value : "";
        this.initial_value = default_value;
        this.state = {
			id: props.id,
			name: props.name ? props.name : "",
			placeholder: props.placeholder,
			value: default_value,
			valid: true,
			canBeEmpty: props.canBeEmpty,
			disabled: props.disabled,
			onBlur: props.onBlur,
			onChange: props.onChange
		};
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
	}
	
	static getDerivedStateFromProps(nextProps, prevState) {
        return {
			id: nextProps.id,
			name: nextProps.name ? nextProps.name : "",
			placeholder: nextProps.placeholder,
			value: nextProps.value ? nextProps.value : "",
			valid: true,
			canBeEmpty: nextProps.canBeEmpty,
			disabled: nextProps.disabled,
			onBlur: nextProps.onBlur,
			onChange: nextProps.onChange
		};
    }
    
    handleChange(event) {
		var valid = true;
		if (!this.state.canBeEmpty && event.target.value === "") {
			valid = false;
		}
		if (valid) {
			valid = this.state.onChange ? this.state.onChange(event.target.value) : valid;
		}
        this.setState({
			value: event.target.value,
			valid: valid
		});
    }
    
    handleBlur(event) {
        if (this.state.onBlur) {
            if (this.state.valid && this.initial_value !== this.state.value) {
                this.initial_value = this.state.value;
                this.state.onBlur(event, this.initial_value);
            } else if (this.initial_value !== this.state.value) {
				if (this.state.onChange) {
					this.state.onChange(this.initial_value);
				}
                this.setState({
					valid: true,
					value: this.initial_value
				});
            }
        }
    }
};

TextComponent.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	placeholder: PropTypes.string,
	canBeEmpty: PropTypes.bool,
	disabled: PropTypes.bool,
	onBlur: PropTypes.func,
	onChange: PropTypes.func
};

TextComponent.defaultProps = {
	id: null,
	name: "",
	value: "",
	placeholder: "",
	canBeEmpty: true,
	disabled: false,
	onBlur: null,
	onChange: null
};

export default TextComponent;
