import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.id,
			name: props.name,
			value: props.value ? props.value: "",
			alone: props.alone,
			disabled: props.disabled,
			onClick: props.onClick
		};
		this.handleClick = this.handleClick.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			id: nextProps.id,
			name: nextProps.name,
			value: nextProps.value ? nextProps.value: "",
			alone: nextProps.alone,
			disabled: nextProps.disabled,
			onClick: nextProps.onClick
		};
	}
	
	handleClick(event) {
		if (this.state.onClick) {
			this.state.onClick(event);
		}
	}
	
	render() {
		var field_name = null;
		if (this.state.name && this.state.name !== "") {
			field_name = (<span className="field_name" style={{display: "block"}}>{this.state.name}:</span>);
		}
		if (this.state.alone) {
			return (
				<div className="field_group">
					{field_name} <button id={this.state.id} className="button" type="button" onClick={this.handleClick} disabled={this.state.disabled}>{this.state.value}</button>
				</div>
			);
		} else {
			return (
				<React.Fragment>
					{field_name} <button id={this.state.id} className="button" type="button" onClick={this.handleClick} disabled={this.state.disabled}>{this.state.value}</button>
				</React.Fragment>
			);
		}
	}
};

Button.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	alone: PropTypes.bool,
	disabled: PropTypes.bool,
	onClick: PropTypes.func
};

Button.defaultProps = {
	id: null,
	name: null,
	value: null,
	alone: true,
	disabled: false,
	onClick: null
};

export default Button;
