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
        this.state = {userLink: null, currencyId: null};

        this.handleUserClick = this.handleUserClick.bind(this);
        this.handleCurrencySelection = this.handleCurrencySelection.bind(this);
    }

    handleUserClick(link) {
        this.setState({userLink: link});
    }
    
    handleCurrencySelection(id) {
        this.setState({currencyId: id});
    }

    handleAddDataClick(event) {
        console.log("add data");
    }

    render() {
        const userLink = this.state.userLink;
        const currencyId = this.state.currencyId;

        return (
            <div>
                <button onClick = {this.handleAddDataClick}>
                    {"Add Data"}
                </button>
                <p />
                <CurrencySelector onCurrencySelect = {this.handleCurrencySelection} />
                <p />
                <Users onUserClick = {this.handleUserClick} currencyId = {currencyId}/>
                <p />
                <NetWorth link = {userLink} currencyId = {currencyId} newValue = {false} />
            </div>
        );
    }
}

/**
 * Top component to handle currency selection.
 */
class CurrencySelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {currencies: [], currencyId: -1};

        this.handleSelection = this.handleSelection.bind(this);
    }

    handleSelection(event) {
        this.setState({currencyId: event.target.value});
        this.props.onCurrencySelect(event.target.value);
    }

    componentDidMount() {
        axios.get("/currencies").then(response => this.setState((prevState, props) => {
            // Set the selector's value to the first id in the list
            let currencyId = -1;
            const currencies = response.data._embedded.currencies;
            if (currencies.length > 0) {
                currencyId = currencies[0].id;
                this.props.onCurrencySelect(currencyId);
            }

            return {prevState, currencies: currencies, currencyId: currencyId}
        }));
    }
    
    render() {
        const currencies = this.state.currencies.map(currency =>
            <Currency
                key = {currency.id}
                id = {currency.id}
                name = {currency.name}
                symbol = {currency.symbol} />
        );

        return(
            <select value = {this.state.currencyId} onChange = {this.handleSelection}>
                {currencies}
            </select>
        );
    }
}

/**
 * Representation of a currency object.
 */
class Currency extends React.Component {

    constructor(props) {
        super(props);
        this.state = {id: this.props.id, name: this.props.name, symbol: this.props.symbol};
    }

    render() {
        return(
            <option value={this.state.id}>{this.state.name + " (" + this.state.symbol + ")"}</option>
        );
    }
}

/**
 * Top component to handle requests for net worth data and subsequent rendering.
 */
class NetWorth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {netWorthData: null, newValue: false};
        
        this.handleNewValue = this.handleNewValue.bind(this);
    }
    
    handleNewValue() {
        this.setState({newValue: true});
    }

    // Get data from the server
    componentDidUpdate(prevProps, prevState, snapshot) {
        const link = this.props.link;
        const currencyId = this.props.currencyId;
        const newValue = this.state.newValue;

        if (link != null && (link !== prevProps.link || currencyId !== prevProps.currencyId || newValue)) {
            axios.get(link + "?currencyId=" + this.props.currencyId).then(response => this.setState((prevState, props) => {
                return {netWorthData: response.data, newValue: false}
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
                link = {"/asset?id=" + asset.id}
                category = {asset.category.name}
                name = {asset.name}
                value = {asset.value}
                onNewValue = {this.handleNewValue} />
        );

        // Build list of liabilities
        const liabilities = data.liabilities.map(liability =>
            <Item
                key = {liability.id}
                link = {"/liability?id=" + liability.id}
                category = {liability.category.name}
                name = {liability.name}
                value = {liability.value}
                onNewValue = {this.handleNewValue} />
        );

        // And show them
        return (
            <table>
                <tbody>
                    <tr>
                        <th colSpan = "2">{data.userName + "'s net worth:"}</th>
                        <th colSpan = "1">{parseFloat(data.netWorth).toFixed(2)}</th>
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
                        <th colSpan = "1">{parseFloat(data.totalAssets).toFixed(2)}</th>
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
                        <th colSpan = "1">{parseFloat(data.totalLiabilities).toFixed(2)}</th>
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
    
    constructor(props) {
        super(props);
        this.state = {value: this.props.value};
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        if (!isNaN(this.state.value)) {
            const f = parseFloat(this.state.value);
            if (!isNaN(f) && f >= 0.0) {
                axios.put(this.props.link + "&value=" + f).then(response => this.props.onNewValue());
            }
        }
        event.preventDefault();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps != this.props) {
            this.setState({value: this.props.value});
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.category}</td>
                <td>{this.props.name}</td>
                <td>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={parseFloat(this.state.value).toFixed(2)} onChange={this.handleChange} />
                        <input type="submit" value="Save" />
                    </form>
                </td>
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
                onUserClick = {this.props.onUserClick}
                currencyId = {this.props.currencyId} />
        );

        return (
            <table>
                <tbody>
                    <tr>
                        <th colSpan="3">Name</th>
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
