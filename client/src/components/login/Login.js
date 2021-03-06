import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import DelayLink from '../helper/Delay';

export default class Login extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

 signin(){
    console.log(this.state);
    axios.post("/api/login", {
      email: this.state.email,
      password: this.state.password
    }).then((data) =>{
      console.log(data);
      this.getUser();
    })
  }

  getUser(){
    axios.get("/api/dashboard").then(function(user){
      console.log(user);
      console.log(user.data.id);
    })

  }

  handleChange(e){
    console.log(e.target.value)
    console.log(e.target.name)
    this.setState({[e.target.name] : e.target.value})
  }

  handleSubmit(e){
    console.log(this.state)
    this.signin(this.state)
    this.setState({
      email: '',
      password: ''
    })
  }

  render() {
    return (
            <div>
            <div id="headWrap" className="titleTab">
              <div>
                <img src="assets/images/btlogo3.png" />
                <h1 id="title">
                  Block Trade
                </h1>
              </div>
            </div>
            <div id="text-body">
              <div id="loginRegister">
                <h1>
                  Login
                </h1>
                <form id="loginform" name="signin" method="post">
                  <label className="label" htmlFor="email" name="uname">Email Address:</label>
                  <input className="text" name="email" type="email" onChange={this.handleChange} value={this.state.email} />
                  <br></br>
                  <label className="label" htmlFor="password">Password:</label>
                  <input className="text" name="password" type="password" onChange={this.handleChange} />
                    <button className="btn-style" type="submit" onClick={(e) => this.handleSubmit(e)} defaultValue="Sign In"><DelayLink className="linkstyle" to="/dashboard">Submit</DelayLink></button>
                </form>
              </div>
            </div>
          </div>
        );
    };
  };