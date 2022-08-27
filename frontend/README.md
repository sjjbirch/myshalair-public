# Myshalair - a dog breeder's website

## Purpose

The purpose of this website is to have an online presence for a small business that breeds dogs. The owner of the business would like to have a website that allows her to maintain communication with other breeders and with owners of her stock so that she is better able to build a dog-based community.

It impliments material ui and react bootstrap for its styling framework, this is done to emphasize a standard styling criteria while being able to quickly and easily design pages and alter how they render based off a veriety of factors.
Myshalair also impliments a variety of tools specific to react functionality, react-router allows for easy and smart routing and rendering of unique components while material ui's date picker addon makes it easy to select and save dates, using Moment as the main date handling framework due to its ease of use and easily implimented support for a veriety of date formats.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the basic template.

## Running Myshalair

### `npm install`

Has to be run inorder to install all dependancies that Myshalair requires to function.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Runs the app in test mode,<br/>
Runs 5 unit tests on the sign in page and 1 on the main app page,

## Functionality

The primary function of the website is to allow information about breeding dogs to be displayed and managed. With features such as being able to mark dogs as retired or even prevent them from being displayed entirely. Litters produced by breeding dogs will automatically generate information for the puppies and the breeder is able to upload images of the litter inorder to build a gallery, additionally puppies are able to be created with a main_image inorder to immidiatly build insterest. Ownership of a puppy entitles an owner to maintain an account on the website.

Client rendering will occur for the display pages for dogs and litters, enabling richly animated and responsive user experiences. Server rendering will be used by exception.

## Target audience

People that like cocker spaniels and want to buy prize winning examples in the Brisbane area. One imagines mostly wealthy middle aged women, but one is only imagining.

## Tech stack

The website has a React front end, which makes use of Material Ui and its depenancies, incuding Emotion, fontsource/roboto, date-io and moment. It also impliments react-bootstrap for additional styling tools. It uses axios to handle requests and responses from the backend and dnd-kit for drag and drop functionality. Needing to support image uploading form-data and form-data-extended are used to easily convert objects into FormData for posting.

The app uses @testing-library for its tests, these include @testing-library/dom, @testing-library/jest-dom, @testing-library/react, and @testing-library/user_event. It also employs jsdom and global-jsdom for a more robust testing environment with jest for additional features and testing support. react-test-rendered is used to mock browwser environment for rendering more accurate to react 18.2, and msw is used to mock any api requests and responses that are made

The Rails back end uses a Postgres DB. Images are stored on Cloudinary and their implementation on the website is handled by the activestorage module of Rails. Payment will be handled by Stripe.

The website will be hosted on a Heroku free instance during UAT, with the decision of whether to move it to a more robust instance and the provider of the instance to be made by the customer after UAT.

## Depenencie breakdown

### Production

@date-io/moment: Version of date-io that has been built around the momentjs date framework, is used to manage date creation and formatting on the front end
@dnd-kit/core: Core logic for dnd-kit that provides drag and drop functionality via the use of useDroppable and useDraggable hooks to mark components as either a droppable container or a draggable elemnt
@dnd-kit/sortable: An addon to dnd-kit/core that allows for a less detailed combined hook that also supports second dimentionall drag and drop making it possible to drag and drop grid items to any other location within the grid
@dnd-kit/utilities: Prodives a variety of interesting tools that expand on smaller areas of dnd-kit, only used for dynamic styling changes inorder to improve the aesthetic of dragging and dropping components
@emotion/styled: Styling framework used by material ui to allow detailed inline styling of its components
@emotion/react: An expantion on the emotion styling framework to expand its functionality to JSX components
@fontsource/roboto: Default font framwork for material ui's typography component
@mui/icons-material: Material ui's icon library, grants access to wide range of unique and stylish icons that are used through the application
@mui/material: Material ui's core component, provides access to material ui's wide and useful variety of components to make styling easy and symple
@mui/x-date-pickers: Date-picker component from material ui, allows for a fancy calander element to be used for any date input, uses moment as a date framework.
axios: Acts as the middleware between the front end and back, provides extremely useful functionality for customising requests and responses while keeping it extremely simple and easy to understand
bootstrap & react-bootstrap: An additional styling framework that much like material ui provides a wide variety of components to smooth the styling process. Its navbar components is the core for user navigation through the app.
form-data & form-data-extended: form-data and its framework where essencial in being able to iron out image uploading, its added form-data-extended, particaly made it extremely simple and easy to construct objects and convert them to FormData just before making a request.
moment: Date framework used by material ui's Date-picker via @date-io
react-router & react-router-dom: React-router was used as the front end routing framework inorder to make maintaining local and global state simple and easy inorder to minimise the amount of requests that get made inorder to keep the variety of data updated.

### Development

@testing-library: This is the core testing framework that was used to write tests for the front end. Specifically /dom and /react allows for easy mimicing of a normal react evironment inorder to ensure tests are running as close to the real app as possible. /jest-dom and /user-event are also used for testing, making a variety of jest based functionality available and directly intigrated into the main @testing-library bundle, and user-event allows for a more detailed and accurate 'how a user would interect with a component' testing behaviour.
jsdom & global-jsdom: jsdom is a pure javascript testing environment seeking to emulate as much of a web browser environment inorder to maximise the validity of tests. global-jsdom specifically seperates jsdom from requiring a testing framework such as jest allowing it to run more freely no matter the environment
jest: Jest is an extremely useful framework for testing to keep on hand, allowing for advance system mocking or spying ability it was mostly used to delay a test untill the right opertune time inorder to prevent false failures
msw: MSW is a simple and easy way to mock network traffic, able to watch on a route, and mock a response in a far simpler and easy to impliment format than any other more general testing framework like jest
react-test-renderer: react-test-rendered is the core to react testing allowing for easy renderering of any react component no matter its possition in a DOM tree, it allows for a variety of tests to be performed directly on a react component or even simply mimic reacts render technoloy inorder to minimise test specific errors that can occurd with a different in environment
