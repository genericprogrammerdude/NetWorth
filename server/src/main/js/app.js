const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDOM = require('react-router-dom');
const axios = require('axios');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: [], languages: []};
    }

    componentWillMount() {
        axios.get('/users').then(response => this.setState((prevState, props) => {
            return {prevState, users: response.data._embedded.users}
        }));
        axios.get('/languages').then(response => this.setState((prevState, props) => {
            return {prevState, languages: response.data._embedded.languages}
        }));
    }

    render() {
        return (
            <UserList users={this.state.users}/>
        )
    }
}

class UserList extends React.Component{
    render() {
        var users = this.props.users.map(user =>
            <User
                key={user.id}
                user={user}
                link={user._links.self.href}
                language={user._links.language.href}/>
        );

        return (
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Language</th>
                    </tr>
                    {users}
                </tbody>
            </table>
        )
    }
}

class User extends React.Component{
    render() {
        return (
            <tr>
                <td><a href={"/net-worth/" + this.props.user.id}>{this.props.user.name}</a></td>
                <td><a href={this.props.language}>link</a></td>
            </tr>
        )
    }
}

import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
        (<BrowserRouter>
            <App />
        </BrowserRouter>),
        document.getElementById('react')
)
