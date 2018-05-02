const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDOM = require('react-router-dom');
const axios = require('axios');

import { Switch, Route, BrowserRouter } from 'react-router-dom';

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/networth/:number' component={NetWorth}/>
        </Switch>
    </main>
);

class NetWorth extends React.Component {

    constructor(props) {
        super(props);
        console.log("NetWorth: " + window.location.href);
        this.state = {users: [], languages: []};
    }

    componentWillMount() {
        axios.get('/languages').then(response => this.setState((prevState, props) => {
            return {languages: response.data._embedded.languages}
        }));
    }

    render() {
        return (
            <LanguageList languages={this.state.languages}/>
        )
    }
}
 
class App extends React.Component {

    constructor(props) {
        super(props);
        console.log("App: " + props);
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
                <td><a href={"/networth/" + this.props.user.id}>{this.props.user.name}</a></td>
                <td><ViewUserNetWorth link={"/networth/" + this.props.user.id}/></td>
                <td><a href={this.props.language}>link</a></td>
            </tr>
        )
    }
}

class LanguageList extends React.Component{
    render() {
        var languages = this.props.languages.map(language =>
            <Language
                key={language.id}
                language={language}
                link={language._links.self.href}/>
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
                <td><a href={this.props.language}>link</a></td>
            </tr>
        )
    }
}

class ViewUserNetWorth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              isToggleOn: true,
              link: props.link
        }

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log(this.state.link);
        this.setState(prevState => ({
            prevState,
            isToggleOn: !prevState.isToggleOn
        }));
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ? 'ON' : 'OFF'}
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
