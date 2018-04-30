const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/users'}).done(response => {
            this.setState({users: response.entity._embedded.users});
        });
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
            <User key={user._links.self.href} user={user}/>
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
                <td>some crap</td>
                <td>{this.props.user.language}</td>
            </tr>
        )
    }
}

ReactDOM.render(
        <App />,
        document.getElementById('react')
)
