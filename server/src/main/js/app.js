const React = require('react');
const ReactDOM = require('react-dom');
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
            <User key={user._links.self.href} user={user} language={user._links.language.href}/>
        );

        console.log(this.props);

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

class Language extends React.Component{
    render() {
        return (
            <tr>
                <td>{this.props.language.name}</td>
            </tr>
        )
    }
}

class User extends React.Component{
    render() {
        return (
            <tr>
                <td>{this.props.user.name}</td>
                <td>{this.props.language}</td>
            </tr>
        )
    }
}

ReactDOM.render(
        <App />,
        document.getElementById('react')
)
