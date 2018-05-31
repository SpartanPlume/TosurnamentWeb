import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Thumbnail, OverlayTrigger, Tooltip } from 'react-bootstrap';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			guilds: props.guilds ? props.guilds : []
		}
	}
	
	static getDerivedStateFromProps(nextProps, prevState) {
		return { guilds: nextProps.guilds };
	}
	
	render() {
		var guilds_icon = [];
		if (this.state.guilds) {
			var guild_icon;
			var guild;
			for (var i = 0; i < this.state.guilds.length; i++) {
				guild_icon = null;
				guild = this.state.guilds[i];
				if (guild.icon) {
					guild_icon = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon + ".png";
				}
				guilds_icon.push(
					<Col key={i} xs={6} md={2}>
						<OverlayTrigger overlay={<Tooltip id={guild.id}>{guild.name}</Tooltip>}>
							<Thumbnail href={"/guilds/" + guild.id} alt={guild.name} src={guild_icon}/>
						</OverlayTrigger>
					</Col>
				);
			}
		}
		return (
			<div>
				<h2>Home</h2>
				<Grid>
					<Row bsClass="row display-flex">
						{guilds_icon}
					</Row>
				</Grid>
			</div>
		);
	}
}

Home.propTypes = {
	guilds: PropTypes.array
};

Home.defaultProps = {
	guilds: []
};

export default Home;
