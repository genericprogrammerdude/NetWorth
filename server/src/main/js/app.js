const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDOM = require('react-router-dom');
const axios = require('axios');

import { Switch, Route, BrowserRouter } from 'react-router-dom';

/**
 * Root component.
 */
class Main extends React.Component {

    constructor(props) {
        super(props);
        this.handleUserClick = this.handleUserClick.bind(this);
        this.state = {userLink: null};
    }

    handleUserClick(link) {
        this.setState({userLink: link});
    }

    render() {
        const userLink = this.state.userLink;

        return (
            <div>
                <Users onUserClick = {this.handleUserClick} />
                <NetWorth link = {userLink} />
            </div>
        );
    }
}

/**
 * Top component to handle requests for net worth data and subsequent rendering.
 */
class NetWorth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {netWorthData: null};
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        const link = this.props.link;
        if (link && link !== prevProps.link) {
            axios.get('/users').then(response => this.setState((prevState, props) => {
                return {prevState, netWorthData: response.data._embedded.users}
            }));
            /*
            axios.get(link).then(response => this.setState((prevState, props) => {
                console.log("NetWorth.componentWillReceiveProps(): " + response.data._embedded);
                return {assets: response.data._embedded}
            }));
            */
        }
    }

    render() {
        return <NetWorthData data = {this.state.netWorthData} />
    }
}
 
/**
 * Top component to handle requests for user data and subsequent rendering.
 */
class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount() {
        axios.get("/users").then(response => this.setState((prevState, props) => {
            return {prevState, users: response.data._embedded.users}
        }));
    }

    render() {
        var users = this.state.users.map(user =>
            <User
                key = {user.id}
                user = {user}
                link = {user._links.self.href}
                language = {user._links.language.href}
                onUserClick = {this.props.onUserClick} />
        );

        return (
            <table>
                <tbody>
                    <tr>
                        <th colSpan="2">Name</th>
                    </tr>
                    {users}
                </tbody>
            </table>
        )
    }
}

class User extends React.Component{
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.user.name}</td>
                <td><ViewUserNetWorthButton link = {"/networth/" + this.props.user.id} onUserClick = {this.props.onUserClick} /></td>
            </tr>
        )
    }
}

class ViewUserNetWorthButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            link: props.link
        }

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onUserClick(this.state.link);
    }

    render() {
        return (
            <button onClick = {this.handleClick}>
                {"View Net Worth"}
            </button>
        );
    }
}


ReactDOM.render(
        (<BrowserRouter>
            <Main />
        </BrowserRouter>)
        ,
        document.getElementById('react')
)
