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

class NetWorth extends React.Component {

    constructor(props) {
        super(props);
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        const link = this.props.link;
        if (link !== prevProps.link) {
            console.log("NetWorth.componentWillReceiveProps(): " + link);
            axios.get(link).then(response => this.setState((prevState, props) => {
                console.log("NetWorth.componentWillReceiveProps(): " + response.data._embedded);
                return {assets: response.data._embedded}
            }));
        }
    }

    render() {
        const link = this.props.link;

        if (link) {
            return <p>NetWorthData</p>
        } else {
            return <div />;
        }
    }
}
 
class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount() {
        axios.get('/users').then(response => this.setState((prevState, props) => {
            return {prevState, users: response.data._embedded.users}
        }));
    }

    render() {
        return (
            <UserList users={this.state.users} onUserClick = {this.props.onUserClick} />
        )
    }
}

class UserList extends React.Component{
    render() {
        var users = this.props.users.map(user =>
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
                <td><ViewUserNetWorth link = {"/networth/" + this.props.user.id} onUserClick = {this.props.onUserClick} /></td>
            </tr>
        )
    }
}

class ViewUserNetWorth extends React.Component {

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
