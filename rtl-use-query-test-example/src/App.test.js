import React from 'react';
// import {act} from 'react-dom/test-utils';
import {render, fireEvent, cleanup} from 'react-testing-library';
import 'jest-dom/extend-expect';
import axios from 'axios';

import App from './App';

afterEach(cleanup);

function renderApp(props) {
  const utils = render(<App {...props} />);

  const usernameInput = () => utils.queryByLabelText('Username');
  const submitButton = () => utils.queryByText('Find', {selector: 'button'});

  const infoText = () => utils.queryByText(/INFO:/i);
  const results = () => utils.queryByTestId('result');
  const error = () => utils.queryByText(/error:/i);
  const loadingText = () => utils.queryByText(/loading.../i);

  return {
    ...utils,
    usernameInput,
    submitButton,
    infoText,
    loadingText,
    results,
    error,
    changeUsername: value =>
      fireEvent.change(usernameInput(), {target: {value}}),
    submitForm: () => fireEvent.click(submitButton()),
  };
}

describe('App', () => {
  it('displays proper elements on initial render', () => {
    const {
      submitButton,
      usernameInput,
      infoText,
      loadingText,
      results,
      error,
    } = renderApp();

    expect(usernameInput()).toBeInTheDocument();
    expect(usernameInput().value).toEqual('');

    expect(submitButton()).toBeInTheDocument();
    expect(submitButton()).not.toBeDisabled();

    expect(infoText()).toBeInTheDocument();

    expect(loadingText()).not.toBeInTheDocument();
    expect(results()).not.toBeInTheDocument();
    expect(error()).not.toBeInTheDocument();
  });
  describe('form', () => {
    it('works on the happy path', async () => {
      const mockData = {
        html_url: 'https://github.com/bgord',
        login: 'bgord',
        name: 'Bartosz Gordon',
        location: 'Poland',
      };
      jest.spyOn(axios, 'get').mockResolvedValue({data: mockData});
      const {
        findByText,
        changeUsername,
        submitForm,
        loadingText,
        submitButton,
        infoText,
        error,
        results,
      } = renderApp();

      changeUsername('bgord');
      submitForm();

      expect(loadingText()).toBeInTheDocument();

      expect(submitButton()).toBeDisabled();
      expect(infoText()).not.toBeInTheDocument();
      expect(error()).not.toBeInTheDocument();
      expect(results()).not.toBeInTheDocument();

      await findByText(`Profile: ${mockData.html_url}`);
      await findByText(`Username: ${mockData.login}`);
      await findByText(`Name: ${mockData.name}`);
      await findByText(`Location: ${mockData.location}`);

      expect(error()).not.toBeInTheDocument();
      expect(infoText()).not.toBeInTheDocument();
      expect(loadingText()).not.toBeInTheDocument();

      expect(submitButton()).not.toBeDisabled();

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.github.com/users/bgord',
      );
    });
    it('works on the error path', async () => {
      const mockError = {
        response: {
          data: {
            message: 'User not found',
          },
        },
      };
      jest.spyOn(axios, 'get').mockRejectedValue(mockError);
      const {
        findByText,
        changeUsername,
        submitForm,
        loadingText,
        submitButton,
        infoText,
        error,
        results,
      } = renderApp();
      changeUsername('oeiajgoae');
      submitForm();

      expect(loadingText()).toBeInTheDocument();

      expect(submitButton()).toBeDisabled();
      expect(infoText()).not.toBeInTheDocument();
      expect(error()).not.toBeInTheDocument();
      expect(results()).not.toBeInTheDocument();

      await findByText(`Error: ${mockError.response.data.message}`);

      expect(results()).not.toBeInTheDocument();
      expect(infoText()).not.toBeInTheDocument();
      expect(loadingText()).not.toBeInTheDocument();

      expect(submitButton()).not.toBeDisabled();

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.github.com/users/oeiajgoae',
      );
    });
  });
});
