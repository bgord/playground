import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createEpicMiddleware, ofType } from "redux-observable";
import {
	mergeMap,
	pluck,
	tap,
	catchError,
	map,
	switchMap,
	debounceTime,
	distinctUntilChanged,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";
import "./index.css";
import { AppComponent } from "./App";
import registerServiceWorker from "./registerServiceWorker";

const initialState = { people: [], isPending: false, error: "" };

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case "ADD_PERSON":
			return {
				...state,
				isPending: true,
			};
		case "ADD_PERSON_SUCCESS":
			return {
				people: [...state.people, action.payload],
				isPending: false,
				error: "",
			};
		case "ADD_PERSON_ERROR":
			return {
				...state,
				isPending: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

const GITHUB_USERS_URL = "https://api.github.com/users";

const addPersonSuccessAction = payload => ({
	type: "ADD_PERSON_SUCCESS",
	payload,
});

const addPersonErrorAction = payload => ({
	type: "ADD_PERSON_ERROR",
	payload,
});

const epic = action$ =>
	action$.pipe(
		ofType("ADD_PERSON"),
		pluck("payload"),
		// mergeMap wysyła każdego requesta, tworzy observable, rozwiązuje go i wywołuje którąś z akcji
		// switchMap anuluje poprzedni request
		debounceTime(250),
		// distinctUntilChanged(),
		switchMap(payload =>
			ajax.get(`${GITHUB_USERS_URL}/${payload}`).pipe(
				pluck("response"),
				// map wartość observabla
				map(response => addPersonSuccessAction(response)),
				// catchError przerywa (rozwiązuje) stream i kontynuuje go dalej
				catchError(error => of(addPersonErrorAction(error)))
			)
		)
	);

const epicMiddleware = createEpicMiddleware();

const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

epicMiddleware.run(epic);

ReactDOM.render(
	<Provider store={store}>
		<AppComponent />
	</Provider>,
	document.getElementById("root")
);
registerServiceWorker();
