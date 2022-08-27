import React from 'react';
import { render, screen } from '../setupTests';
import App from '../Components/App/App';

describe("<App />", () => {
  test("Renders <App /> component correctly", () => {
    render(<App />);
    expect(
      screen.getByTestId('header-img')
    ).toBeInTheDocument();
  });
});