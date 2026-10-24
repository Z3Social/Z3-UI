import { jest } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import LinkHeader from 'http-link-header';
const api = jest.requireActual('../api');
let mocks = [];
export const __stub = func => mocks.push(func);
export const __clear = () => mocks = [];
const setupMock = axios => {
  const mock = new MockAdapter(axios, {
    onNoMatch: 'throwException'
  });
  mocks.map(func => func(mock));
};
export const staticClient = api.staticClient;
export const getLinks = response => {
  return new LinkHeader(response.headers?.link);
};
export const baseClient = (...params) => {
  const axios = api.baseClient(...params);
  setupMock(axios);
  return axios;
};
export default (...params) => {
  const axios = api.default(...params);
  setupMock(axios);
  return axios;
};