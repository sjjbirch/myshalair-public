// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import React from "react";
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { StateProvider } from './Components/utils/stateContext';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const Wrapper = ({ children }) => {
  return (
    <StateProvider>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </StateProvider>
  );
};

const customRender = (ui, options) => {
  render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';

export { customRender as render };
