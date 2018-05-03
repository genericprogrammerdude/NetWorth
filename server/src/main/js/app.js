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

    render() {
        const userLink = this.state.userLink;
        const currencyId = this.state.currencyId;

        return (
            <div>
                <CurrencySelector onCurrencySelect = {this.handleCurrencySelection} />
                <p />
                <Users onUserClick = {this.handleUserClick} />
                <p />
                <NetWorth link = {userLink} currencyId = {currencyId} />
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
        this.state = {netWorthData: null, totalAssetConvertedValue: 0.0, totalLiabilityConvertedValue: 0.0};

        this.addConvertedAssetValue = this.addConvertedAssetValue.bind(this);
        this.addConvertedLiabilityValue = this.addConvertedLiabilityValue.bind(this);
    }

    // Get data from the server
    componentDidUpdate(prevProps, prevState, snapshot) {
        const link = this.props.link;

        if (link && link !== prevProps.link) {
            axios.get(link).then(response => this.setState((prevState, props) => {
                return {netWorthData: response.data}
            }));
        }
    }
    
    addConvertedAssetValue(value) {
        this.setState({totalAssetConvertedValue: this.state.totalAssetConvertedValue + value});
    }

    addConvertedLiabilityValue(value) {
        this.setState({totalLiabilityConvertedValue: this.state.totalLiabilityConvertedValue + value});
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
                originalValue = {asset.value}
                originalCurrency = {asset.currency.id}
                originalCurrencySymbol = {asset.currency.symbol}
                convertedCurrency = {this.props.currencyId}
                addConvertedValue = {this.addConvertedAssetValue} />
        );

        // Build list of liabilities
        const liabilities = data.liabilities.map(liability =>
            <Item
                key = {liability.id}
                category = {liability.category.name}
                name = {liability.name}
                originalValue = {liability.value}
                originalCurrency = {liability.currency.id}
                originalCurrencySymbol = {liability.currency.symbol}
                convertedCurrency = {this.props.currencyId}
                addConvertedValue = {this.addConvertedLiabilityValue} />
        );

        const netWorth = (this.state.totalAssetConvertedValue - this.state.totalLiabilityConvertedValue).toFixed(2);
        const totalAssets = this.state.totalAssetConvertedValue.toFixed(2);
        const totalLiabilities = this.state.totalLiabilityConvertedValue.toFixed(2);

        // And show them
        return (
            <table>
                <tbody>
                    <tr>
                        <th colSpan = "3">{data.userName + "'s net worth:"}</th>
                        <th colSpan = "1">{netWorth}</th>
                    </tr>
                    <tr>
                        <th colSpan = "4">Assets</th>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Original Value</th>
                        <th>Converted Value</th>
                    </tr>
                    {assets}
                    <tr>
                        <th colSpan = "3">Assets Total:</th>
                        <th colSpan = "1">{totalAssets}</th>
                    </tr>
                    <tr>
                        <th colSpan = "4"></th>
                    </tr>
                    <tr>
                        <th colSpan = "4">Liabilities</th>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Original Value</th>
                        <th>Converted Value</th>
                    </tr>
                    {liabilities}
                    <tr>
                        <th colSpan = "3">Liabilities Total:</th>
                        <th colSpan = "1">{totalLiabilities}</th>
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
        this.state = {convertedValue: 0};
    }
    
    componentDidMount() {
        if (this.props.originalCurrency != this.props.convertedCurrency) {
            // Need to convert
            // TODO: These queries should be cached locally.
            const url = "/exchange?fromId=" + this.props.originalCurrency + "&toId=" + this.props.convertedCurrency;
            axios.get(url).then(response => this.setState((prevState, props) => {
                const originalValue = parseFloat(this.props.originalValue);
                const rate = parseFloat(response.data.rate);
                const converted = originalValue * rate;
                this.props.addConvertedValue(converted);
                return {prevState, convertedValue: converted};r
            }));
        } else {
            this.setState({convertedValue: this.props.originalValue});
        }
    }


    render() {
        return (
            <tr>
                <td>{this.props.category}</td>
                <td>{this.props.name}</td>
                <td>{this.props.originalValue + " " + this.props.originalCurrencySymbol}</td>
                <td>{this.state.convertedValue}</td>
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
