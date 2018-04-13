import React, { Component } from 'react';
import './App.css';
import './bootstrap.min.css';
import Body from './components/Body';
import { ToastContainer, style } from "react-toastify";
import Header from "./components/Header";

style({
  width: "320px",
  colorDefault: "#fff",
  colorInfo: "#bcbcbc",
  colorSuccess: "#48c49d",
  colorWarning: "#f1c40f",
  colorError: "#e74c3c",
  colorProgressDefault: "none",
  mobile: "only screen and (max-width : 480px)",
  fontFamily: "sans-serif",
  zIndex: 9999,
  TOP_LEFT: {
    top: '1em',
    left: '1em'
  },
  TOP_CENTER: {
    top: '1em',
    marginLeft: `-${320/2}px`,
    left: '50%'
  },
  TOP_RIGHT: {
    top: '1em',
    right: '1em'
  },
  BOTTOM_LEFT: {
    bottom: '1em',
    left: '1em'
  },
  BOTTOM_CENTER: {
    bottom: '1em',
    marginLeft: `-${320/2}px`,
    left: '50%'
  },
  BOTTOM_RIGHT: {
    bottom: '1em',
    right: '1em'
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <Body/>
        <ToastContainer/>
      </div>
    );
  }
}

export default App;
