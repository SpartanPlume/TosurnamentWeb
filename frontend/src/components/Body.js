import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import Editable from "./Editable";
import MainSettings from "./MainSettings";
import BracketsSettings from "./BracketsSettings";
import ReschedulesSettings from "./ReschedulesSettings";
import PostResultSettings from "./PostResultsSettings";
import { Grid, Row, Col, Thumbnail } from "react-bootstrap";

const queryString = require('query-string');

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session_token: props.session_token !== undefined ? props.session_token : null,
      guilds: JSON.parse(sessionStorage.getItem("guilds")) || null
    };
    this.discordCallback = this.discordCallback.bind(this);
    if (this.state.guilds === null) {
      fetch("http://localhost:4000/discord/guilds", {
        headers: {
          'Authorization': props.session_token
        }
      })
        .then(response => response.json())
        .then(results => {console.log(results); sessionStorage.setItem("guilds", JSON.stringify(results)); this.setState({session_token: this.state.session_token, guilds: results});})
        .catch(error => console.log(error));
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState === null || prevState.session_token !== nextProps.session_token) {
      return {session_token: nextProps.session_token};
    }
    return null;
  }

  discordCallback(props) {
    const formData = queryString.parse(props.location.search);
    if (this.state.session_token !== null) {
      formData["session_token"] = this.state.session_token;
    }
    fetch("http://localhost:4000/discord/token", {
            method: "POST",
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
            .then(response => response.json())
            .then(results => {localStorage.setItem('session_token', results.session_token); this.props.history.push("/")})
            .catch(error => {console.log(error)});
    return(<Redirect to="/loading" />);
  }

  render() {
    return (
      <div id="body">
        <Route exact path="/" render={(props) => {return (<Home guilds={this.state.guilds} {...props} />);}}/>
        <Route exact path="/loading" component={Loading} />
        <Route exact path="/tournaments" component={Tournaments} />
        <Route path="/guild/:number" render={(props) => {return (<Tournament session_token={this.state.session_token} guild={this.state.guilds.find((guild) => guild.id === props.match.params.number)} {...props} />);}} />
        <Route path="/api/discord/callback" render={(props) => {return this.discordCallback(props)}} />
      </div>
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guilds: props.guilds !== undefined && props.guilds !== null ? props.guilds : []
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.guilds !== prevState.guilds) {
      return {guilds: nextProps.guilds};
    }
    return null;
  }

  render() {
    var guild_icon;
    var guilds_icon = [];
    var guild;
    if (this.state.guilds !== undefined && this.state.guilds !== null) {
      for (var i = 0; i < this.state.guilds.length; i++) {
        guild = this.state.guilds[i];
        if (guild.icon !== undefined) {
          guild_icon = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon + ".png";
        }
        guilds_icon.push(<Col key={i} xs={6} md={2}><Thumbnail href={"/guild/" + guild.id} alt={guild.name} src={guild_icon} /></Col>);
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

const Tournaments = ({ match }) => (
  <div>
    <h2>Tournaments</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:number`} component={Tournament} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

class Loading extends React.Component {
  render() {
    return (<span>Loading</span>);
  }
}

class Tournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      guild: props.guild !== undefined ? props.guild : null,
      roles: JSON.parse(sessionStorage.getItem("roles")),
      channels: JSON.parse(sessionStorage.getItem("channels"))
    };
    this.toast_id = null;
  }

  componentDidMount() {
    if (this.state.guild !== null && this.props.session_token !== undefined && this.props.session_token !== null && (this.state.roles === null || this.state.channels === null)) {
      Promise.all([
        fetch("http://localhost:4000/discord/guilds/" + this.state.guild.id + "/roles", { headers: { "Authorization": this.props.session_token } }),
        fetch("http://localhost:4000/discord/guilds/" + this.state.guild.id + "/channels", { headers: { "Authorization": this.props.session_token } })
      ])
      .then(([roles, channels]) => Promise.all([roles.json(), channels.json()]))
      .then(([roles, channels]) => {sessionStorage.setItem("roles", JSON.stringify(roles)); sessionStorage.setItem("channels", JSON.stringify(channels)); this.setState({ tournament: this.state.tournament, guild: this.state.guild, roles: roles, channels: channels})})
      .catch(error => console.log(error));
    }
    fetch("http://localhost:4000/tournaments/" + this.state.guild.id)
    .then(result => result.json())
    .then(tournament => this.setState({ tournament: tournament }))
    .catch(error => console.log(error));
  }

  dismissToast() {
    if (this.toast_id !== null) {
      toast.dismiss(this.toast_id);
    }
  }

  updateTournament() {
    if (arguments.length === 3) {
      //var event = arguments[1];
      var value = arguments[2];
      if (this.state.tournament !== undefined) {
        this.dismissToast();
        this.toast_id = toast.info("Saving changes...", {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          autoClose: 3000
        });
        const formData = {};
        formData[arguments[0]] = value;
        fetch("http://localhost:4000/tournaments/" + this.state.tournament.id, {
          method: "PUT",
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
          .then(response => response.json())
          .then(results => {this.dismissToast(); this.toast_id = toast.success("Success!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
          })})
          .catch(error => {this.dismissToast(); this.toast_id = toast.error("Error ='(", {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
          })});
      };
    }
  }

  updateBracket() {
    if (arguments.length === 4) {
      var bracket_id = arguments[0];
      //var event = arguments[2];
      var value = arguments[3];
      if (this.state.tournament !== undefined) {
        if (parseInt(bracket_id, 10) > 0) {
          this.dismissToast();
          this.toast_id = toast.info("Saving changes...", {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
          });
          const formData = {};
          formData[arguments[1]] = value;
          fetch("http://localhost:4000/brackets/" + bracket_id, {
            method: "PUT",
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
            .then(response => response.json())
            .then(results => {this.dismissToast(); this.toast_id = toast.success("Success!", {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
              autoClose: 3000
            })})
            .catch(error => {this.dismissToast(); this.toast_id = toast.error("Error ='(", {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
              autoClose: 3000
            })});
      } else {
        /*this.dismissToast();
          this.toast_id = toast.info("Creating a new bracket...", {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
          });*/
          const formData = {};
          formData["name"] = "New bracket";
          formData["tournament_id"] = this.state.tournament.id;
          return fetch("http://localhost:4000/brackets", {
            method: "POST",
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
        }
      }
    }
  }

  deleteBracket() {
    if (arguments.length === 1) {
      var bracket_id = arguments[0];
      if (this.state.tournament !== undefined) {
        this.dismissToast();
        this.toast_id = toast.info("Deleting bracket...", {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          autoClose: 3000
        });
        fetch("http://localhost:4000/brackets/" + bracket_id, {
          method: "DELETE"
        })
          .then(response => response.json())
          .then(results => {this.dismissToast(); this.toast_id = toast.success("Success!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
          })})
          .catch(error => {this.dismissToast(); this.toast_id = toast.error("Error ='(", {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
          })});
      }
    }
  }

  render() {
    if (this.state.tournament === undefined || (Object.keys(this.state.tournament).length === 0 && this.state.tournament.constructor === Object)) {
      return (<div />);
    }
    return (
      <div>
        <Editable id="tournament_name" value={this.state.tournament.name} onBlur={this.updateTournament.bind(this, "name")} placeholder="My Tournament" />
        <MainSettings tournament={this.state.tournament} channels={this.state.channels} roles={this.state.roles} update={this.updateTournament.bind(this)} />
        <BracketsSettings tournament={this.state.tournament} roles={this.state.roles} update={this.updateBracket.bind(this)} delete={this.deleteBracket.bind(this)} />
        <ReschedulesSettings tournament={this.state.tournament} update={this.updateTournament.bind(this)} />
        <PostResultSettings tournament={this.state.tournament} update={this.updateTournament.bind(this)} />        
      </div>
    );
  }
};

export default withRouter(Body);
