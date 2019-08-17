import React from 'react';
import './App.css';
import axios from 'axios';

const STATUSES = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const ACTIONS = {
  INIT: 'INIT',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const initialState = {
  status: STATUSES.IDLE,
  data: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.INIT:
      return {status: STATUSES.PENDING, data: null, error: null};
    case ACTIONS.SUCCESS:
      return {status: STATUSES.SUCCESS, data: action.data, error: null};
    case ACTIONS.ERROR:
      return {status: STATUSES.ERROR, data: null, error: action.data};
    default:
      return state;
  }
};

function useQuery({url, getErrorMesage = e => e.response.data.message}) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(
    () => {
      const triggerRequest = async () => {
        try {
          const {data} = await axios.get(url);
          dispatch({
            type: ACTIONS.SUCCESS,
            data,
          });
        } catch (e) {
          dispatch({
            type: ACTIONS.ERROR,
            data: getErrorMesage(e),
          });
        }
      };
      if (state.status === STATUSES.PENDING) {
        triggerRequest();
      }
    },
    [state.status, url, getErrorMesage],
  );

  return [state, () => dispatch({type: ACTIONS.INIT})];
}

function useInput(defaultValue = '') {
  const [value, setValue] = React.useState(defaultValue);
  const handleValueChange = e => setValue(e.target.value);

  return [value, handleValueChange];
}

function App() {
  const [username, handleUsernameChange] = useInput();
  const [state, trigger] = useQuery({
    url: `https://api.github.com/users/${username}`,
  });

  const handleSubmit = e => {
    e.preventDefault();
    trigger();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={handleUsernameChange} />
        <button type="submit" disabled={state.status === STATUSES.PENDING}>
          Find
        </button>
      </form>
      <section>
        {state.status === STATUSES.IDLE && (
          <p>INFO: use the form to search for a GitHub user</p>
        )}
        {state.status === STATUSES.PENDING && <div>Loading...</div>}{' '}
        {state.status === STATUSES.SUCCESS && (
          <div data-testid="result">
            <div>Profile: {state.data.html_url}</div>
            <div>Username: {state.data.login}</div>
            <div>Name: {state.data.name || '-'}</div>
            <div>Location: {state.data.location || '-'}</div>
          </div>
        )}
        {state.status === STATUSES.ERROR && <div>Error: {state.error}</div>}
      </section>
    </div>
  );
}

export default App;
