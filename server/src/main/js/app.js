const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/languages'}).done(response => {
            this.setState({languages: response.entity._embedded.users});
        });
    }

    render() {
        return (
            <LanguageList languages={this.state.languages}/>
        )
    }
}

class UserList extends React.Component {
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

class LanguageList extends React.Component {
    render() {
        var languages = this.props.languages.map(language =>
            <Language key={language._links.self.href} language={language}/>
        );
        return (
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                    </tr>
                    {languages}
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
                <td>some more crap</td>
            </tr>
        )
    }
}

ReactDOM.render(
        <App />,
        document.getElementById('react')
)
