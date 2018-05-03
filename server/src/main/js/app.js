const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

import { Switch, Route, BrowserRouter } from 'react-router-dom';

/**
 * Root component. Needed to allow NetWorthViewButton to lift state up and notify the NetWorth component. 
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
                <p />
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

    // Get data from the server
    componentDidUpdate(prevProps, prevState, snapshot) {
        const link = this.props.link;
        if (link && link !== prevProps.link) {
            axios.get(link).then(response => this.setState((prevState, props) => {
                console.log("NetWorth.response: " + response.data.netWorth);
                return {netWorthData: response.data}
            }));
        }
    }

    // Display net worth information
    render() {
        const data = this.state.netWorthData;
        if (data === null) {
            return <div />;
        }
        if (data.assets.length === 0 && data.assets.length === 0) {
            return (
                <p>No data for the selected user.</p>
            );
        }

        // Build list of assets
        const assets = data.assets.map(asset =>
            <Item
                key = {asset.id}
                category = {asset.category.name}
                name = {asset.name}
                value = {asset.value} />
        );

        // Build list of liabilities
        const liabilities = data.liabilities.map(liability =>
            <Item
                key = {liability.id}
                category = {liability.category.name}
                name = {liability.name}
                value = {liability.value} />
        );

        // And show them
        return (
            <table>
                <tbody>
                    <tr>
                        <th colSpan = "2">{data.userName + "'s net worth:"}</th>
                        <th colSpan = "1">{data.netWorth}</th>
                    </tr>
                    <tr>
                        <th colSpan = "3">Assets</th>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                    {assets}
                    <tr>
                        <th colSpan = "2">Assets Total:</th>
                        <th colSpan = "1">{data.totalAssets}</th>
                    </tr>
                    <tr>
                        <th colSpan = "3"></th>
                    </tr>
                    <tr>
                        <th colSpan = "3">Liabilities</th>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                    {liabilities}
                    <tr>
                        <th colSpan = "2">Liabilities Total:</th>
                        <th colSpan = "1">{data.totalLiabilities}</th>
                    </tr>
                </tbody>
            </table>
        );
    }
}
 
/**
 * UI representation of an Asset or Liability. They both look the same, so why not share?
 */
class Item extends React.Component {

    render() {
        return (
            <tr>
                <td>{this.props.category}</td>
                <td>{this.props.name}</td>
                <td>{this.props.value}</td>
            </tr>
        )
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
        const users = this.state.users.map(user =>
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

/**
 * UI representation of a User.
 */
class User extends React.Component{

    render() {
        return (
            <tr>
                <td>{this.props.user.name}</td>
                <td><ViewUserNetWorthButton link = {"/networth/" + this.props.user.id} onUserClick = {this.props.onUserClick} /></td>
            </tr>
        )
    }
}

/**
 * Button to select which user's net worth will be shown.
 */
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
        <Main />,
        document.getElementById('react')
)
