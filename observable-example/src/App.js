import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class App extends Component {
	constructor() {
		super();
		this.state = {
			newUser: "",
		};
		this.handleSubmitForm = this.handleSubmitForm.bind(this);
	}
	handleSubmitForm(e) {
		e.preventDefault();
		this.props.addPersonAction(this.state.newUser);
	}
	render() {
		return (
			<div className="App">
				<pre>{JSON.stringify(this.props)}</pre>
				<form onSubmit={this.handleSubmitForm}>
					<input
						required
						type="text"
						value={this.state.newUser}
						onChange={e =>
							this.setState({ newUser: e.target.value }, () =>
								this.props.addPersonAction(this.state.newUser)
							)
						}
					/>
					<pre>{JSON.stringify(this.props.error)}</pre>
					<div>{this.props.isPending && "Loadinnnnnnnnnnn"}</div>
					<button type="submit">Add user</button>
				</form>
			</div>
		);
	}
}

const addPersonAction = payload => ({
	type: "ADD_PERSON",
	payload,
});

const mapStateToProps = ({ people, isPending, error }) => ({
	people,
	isPending,
	error,
});
const mapDispatchToProps = dispatch =>
	bindActionCreators({ addPersonAction }, dispatch);

export const AppComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
