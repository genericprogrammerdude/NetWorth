const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

/**
 * Component to handle data editing.
 */
class DataEditor extends React.Component {

    render() {
        return(
            <div>
                <AddUser />
                <p />
                <AddAsset />
            </div>
        );
    }
}

class AddUser extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {name: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const name = this.state.name;
        if (name && name !== "") {
            const uri = "/adduser?name=" + name;
            console.log(uri);
            axios.post(uri).then(response => {
                console.log(response);
            });
        }
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }
    
    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <th colSpan="2">User</th>
                    </tr>
                    <tr>
                        <td>
                            <form onSubmit={this.handleSubmit}>
                                <input type="text" onChange={this.handleChange} />
                                <input type="submit" value="Add User" />
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class AddAsset extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {name: "", value: 0.0, currencyId: -1, categoryId: -1, userId: -1};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    validateName() {
        const name = this.state.name;
        if (name && name.length > 0) {
            return name;
        }
        return "";
    }
    
    validateValue() {
        if (!isNaN(this.state.value)) {
            const f = parseFloat(this.state.value);
            if (!isNaN(f) && f >= 0.0) {
                return f;
            }
        }
        return -1;
    }

    handleSubmit(event) {
        event.preventDefault();

        const name = this.validateName();
        const value = this.validateValue();
        if (name !== "" && value !== -1) {
            const uri = "/addasset?name=" + name + "&value=" + value + "&currencyId=" + this.state.currencyId
            + "&categoryId=" + this.state.categoryId + "&userId=" + this.state.userId;
            console.log(uri);
            /*
            axios.post(uri).then(response => {
                console.log(response);
            });
            */
        }
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }
    
    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <th colSpan="2">Asset</th>
                    </tr>
                    <tr>
                        <td>
                            <form onSubmit={this.handleSubmit}>
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" onChange={this.handleChangeName} />
                                <input type="submit" value="Add Asset" />
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

module.exports.DataEditor = DataEditor;
