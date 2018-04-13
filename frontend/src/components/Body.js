import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
import Editable from "./Editable";
import MainSettings from "./MainSettings";
import BracketsSettings from "./BracketsSettings";
import ReschedulesSettings from "./ReschedulesSettings";
import PostResultSettings from "./PostResultsSettings";

const Body = () => (
  <Router>
    <div id="body">
      <Route exact path="/" component={Home} />
      <Route exact path="/tournaments" component={Tournaments} />
      <Route path="/tournaments/:number" component={Tournament} />
      <Route path="/api/discord/callback" render={(props) => {console.log(props); return(<Redirect to="/" />);}} />
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

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

class Tournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {}
    };
    this.toast_id = null;
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

  componentDidMount() {
    fetch("http://localhost:4000/tournaments/" + this.props.match.params.number)
      .then(response => response.json())
      .then(results => this.setState({ tournament: results }))
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.tournament === undefined || (Object.keys(this.state.tournament).length === 0 && this.state.tournament.constructor === Object)) {
      return (<div />);
    }
    return (
      <div>
        <Editable id="tournament_name" value={this.state.tournament.name} onBlur={this.updateTournament.bind(this, "name")} placeholder="My Tournament" />
        <MainSettings tournament={this.state.tournament} update={this.updateTournament.bind(this)} />
        <BracketsSettings tournament={this.state.tournament} update={this.updateBracket.bind(this)} delete={this.deleteBracket.bind(this)} />
        <ReschedulesSettings tournament={this.state.tournament} update={this.updateTournament.bind(this)} />
        <PostResultSettings tournament={this.state.tournament} update={this.updateTournament.bind(this)} />        
      </div>
    );
  }
};

export default Body;
