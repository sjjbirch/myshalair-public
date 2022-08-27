# README

## General:
Myshalair is a website for a champion cocker spaniel breeder to manage her customers and litters. 
[Here](https://github.com/sjjbirch/myshalair-public) is the page you're reading this on.
See more info about the business requirement at the bottom in the T3A2-A submission.

### Project management (PRG1006-2.3 Employ and utilise task delegation methodology):
#### HD
The project kanban, containing all current user stories and evidence of prod testing and UAT, is at: https://trello.com/b/YpeL2Tbq/full-stack-app
Here's a picture of it. ![I used to do this for money](/Resources/Workflow/projectmanagement.png)
On the live board, everything to the left of "Current Sprint" is backlog, and everything to the right of "User User Stories" is dropped features.

The project was managed using an Agile methodology, with some some metamanagement done using PRINCE2.

Task delegation was conducted by Solomon because he likes to bully people. The frontend was mostly delegated to Will because he's better with JS and design. The backend was mostly done by Solomon because he's better with Ruby and DB. Deployment tasks were mostly done by Solomon because the customer knows him and she's going to try to rope him into doing permanent devops.

Tasks are tracked on the kanban, and are each tracked by importance and priority. Every US is extensively referenced in git commits. Each sprint collected synergistic user stories and had its own feature branch on git with many commits by each person. The total blame history is roughly 150 commits from Solomon and Will each across about 20 feature branches, and an additional two private staging repos with unreplicated commits.

### Source control (PRG1006-2.1 Employ and utilise proper source control methodology):
#### HD
The website has a git repo (P), a README and gitignore with appropriate content (C), more than 10 feature branches (D) with nearly 100 commits and half a dozen merge PRs from each team member (HD). And that doesn't even include the staging repos with the sexy upstream pulls and crazy merges.

### User and developer testing (PRG1006-7.1 Development testing && PRG1006-7.2 Production testing)
#### Both HD
The site was staged two weeks in advance to permit developer and user testing. [Developer testing tracker](https://docs.google.com/spreadsheets/d/1OBxgfKiWAeLJSm13J-WUgnu3WHjyvQff2FXFoQ1FZZY/edit#gid=0) - see UAT linked user stories on Kanban for the extensive list of new features the client bestowed on us and features she asked for and that we'd already made that were dropped once she tried them and actually thought about what she wanted.

Also, here's a screenshot taken of the website while a user's GPU was dying during UAT. We swear it wasn't awful javascript that fried it.
![gotta love those rendering artifacts when the memory junction is on the way out](/newthings/uat.png)

### Deployment (PRG1006-6.2 Deployment):
#### HD
The frontend is deployed to Netlify and the backend and database to Heroku. The website can be accessed using the custom domain [Myshalair.com](https://www.myshalair.com/) however this is set up using a 302 temporary redirect because the client has not committed to a hosting solution. This means that the underlying frontend URL will be shown in the navbar after the page resolves. The website uses Cloudinary as a CDN for images. The back and front are both deployed from separate staging repos which are downstream of the main repos. This is so that we could share repos with educators without jeopordising the business operations of our customer.

The frontend is running on Ubuntu 20.04.3, Node 16.13.2, NPM and React 8.6.0, and the production build uses the standard React buildpack.
The backend is running on Ubuntu 20.04.4 LTS, Ruby 3.0.2p107 2021-07-07 rev 0db68f0233 and Rails 7.0.3.1.
The DB is running Ubuntu 20.04.4 LTS, PostgreSQL 14.0 build 1914.

### Testing (PRG1006-7.3 Utilises a formal testing framework):
#### D
The backend has 20 unit tests and 2 feature integration tests using RSpec and Capybara driven by Selenium. The frontend uses Jest and has a half dozen unit tests. Testing instructions are below. It's actually unclear what the real code coverage is since we haven't taken the time to ignore the sections of the code base that are not relevant, but we're at least at D average.

## User interface (PRG1006-6.3 User interface):
#### HD/D
The website uses MUI and extensive asynch calls to ensure an intuitive, clean and functional user interface. Of special note is the ability for the administrator to sort the display of dogs across all pages using a [special admin page](http://myshalair.com/dogs/re_order) where she can drag and drop dogs to set their priority for display. This was a challenging feature to implement but was necessary to ensure that there were no impediments to the workflow of the administrative user in carrying out complex operations.

## Functions, ranges, classes (PRG1006-4.3 Utilises functions, ranges and classes)
#### HD
Just look at the absolute chaddery in something as simple as seeds.rb, for example the use of classes, functions and ranges at ``phonenumber: "04#{rand(10000000..30000000)}"`` to generate random valid Australian mobile phone numbers is sophisticated and demonstrates exceptional understanding, or the entirity of the frontend litter update helper called ``updateItemInArray()`` found at ``src/Components/utils/helpers/generalTools.js`` which is used by ``src/Components/Pages/LitterRoute/LitterUpdate/LitterUpdate.js``, which is simply marvelous. A final one is the ``pedigree()`` function in the dogs controller, which is a variable recursive function that builds dog family trees with cool use of ranges and classes.

## Functions (PRG1006-1.2 Demonstrate use of functions)
#### HD
Commenting is gold standard readability and maintainability stuff in the format ``inputs: {inputs}, outputs: {outputs}, called by: {functions that call it}, dependencies: {inverse of called by}, known issues: {known issues}, feature supported: {the features that rely on the function``} applied to every function that isn't default.

## Libraries (CMP1043-1.3 Appropriate use of libraries used in the app)
#### HD
Libraries are enumerated and described in the front-end and back end sections below, at length.

## Flow control (PRG1006-1.1 Demonstrate code flow control)
#### HD
Flawless flow control is demonstrated all over the place. Nary an error to be seen!

## Functionality ( PRG1006-6.1 App functionality):
#### HD
This website is so much more than my next door neighbour deserves, sorry, I meant expects. I meant to say it exceeds user expectations.

## Other marking criteria
#### ?
Yeah. About that. An exercise for the marker.

# Backend
## Usage
### Running tests:
The backend uses Rspec and Capybara driven by Selenium for testing. It has two feature integration tests and about 20 unit tests. To run the tests:
* Install environment, dependencies and bundle install.
* Input your protected credentials for a mailer and activestorage. If using activestorage other than cloudinary be sure to change the Cloudinary calls.
* If you are feeling extremely risky then add ``api: bundle exec rails s -p 3001`` to ``procfile-react-test``, and then run ``foreman start -f procfile-react-test``, but be aware that that foreman seems not to consistently kill Puma servers and you may need to manually troubleshoot if this occurs.
* If you aren't feeling risky then just run ``foreman start -f procfile-react-test`` and in another terminal run ``bundle exec rails s -p 3001``.
* Either way, run ``RAILS_ENV=development bundle exec rspec spec`` to run the integration and unit tests.
* If you'd like the fully automated test experience then append  ``batch_test: sleep 4 && RAILS_ENV=development bundle exec rspec spec`` after ``api: `` in the procfile and then start foreman. This seems to run once and once only without manual troubleshooting.
* If you'd like this issue to be addressed, please go and comment on the [pull request to fix it that's been open for a year even though it has no conflicts](https://github.com/ddollar/foreman/pull/780).
* Note: Tests are to be run against the dev environment. This is a deliberate decision made to reduce API overhead due to the use of free plans for the production and development site. The front end is _not_ integrated with the Rails test environment.

## Config notes
* Dev DB username:postgres pw:postgres port:5432 on localhost
* Web server = puma, listening on port 3001

### Dependencies
#### Environment:
* ubuntu 20.04.4 LTS
* imagemagick 6.9.10-23 Q16 x86_64 2019010
* ruby 3.0.2p107 2021-07-07 rev 0db68f0233
* foreman -0.87.2 (environment, NOT Rails, for testing only; ie gem install foreman NOT in the gemfile)

### Gems:
* rails (7.0.3.1)
Is Rails. You don't need a detailed description.
* image_processing (1.12.2)
An image processing gem that ties into imagemagick. Is used to format uploaded images so that the free tier CDN that our customer insists on using won't need to perform too many costly tranforms.
* mini_magick (4.11.0)
Assists the above.
* rack-cors (1.1.1)
Handles cross origin resource sharing. In dev environment it is configured in ``config/initializers/cors.rb`` to be very permissive in dev but strict in prod.
* responders (3.0.1)
This gem is a dependency of devise-jwt that is used to allow it to pass error messages to and from JSON format.
* acts_as_list (1.0.4)
This gem adds functions to allow models to act as lists by adding an additional field on the record called "position" or otherwise defined. That field then sorts the records in that model and includes helper functions for inserting objects at points in the list, moving things to the top of lists or moving them to the bottom. This gem is essential for persisting admin decisions about which dogs to display first and for automating business logic on the display order of applications for puppies in management screens for the admin.
* 'cloudinary'
A gem to make cloudinary work for active storage.
* "devise"
Basic devise. A feature rich authentication gem that has absolutely no support for API servers. Only... It kind of does because it uses another gem called Warden behind the scenes.
* "devise-jwt"
Queue devise-jwt, which reconfigures Warden to allow devise to use token authentication. Permits a number of token authentication strategies; we tried a few during development and ended up settling on the denylist strategy, where tokens are recorded on their own table joined to users with a join table, and are progressively denied as they time out.

### Test and dev gems:
* 'faker'
A gem for generating fake information. Used extensively for seeding and for generating test elements.
*  gem 'capybara', '~> 2.4.4'
A gem for running integration testing in Rails apps. Integrates with Rspec for testing features and with Selenium webdriver for browser features.
*  gem 'selenium-webdriver'
Selenium is a special Chrome driver for testing. It is basically Chrome, but with certain user centric features removed and certain testing centric features added. It is called by capybara in this setup.
*  gem 'capybara-screenshot', '~> 1.0.11'
A gem that lets capybara take and save screenshots when an integration test fails, so that you can look at what the browser was showing when the failure occured later after running your test suite.
*  gem "rspec-rails", "~> 5.1"
A robust and feature rich gem for running tests in Rails. Automatically generates many unit tests based on rails conventions and has robust support for additional unit or integration tests.
*  gem 'simplecov'
A coverage reporting gem that integrates with Rspec (among other options) to generate test reports. The report, once generated automatically by running the test suite, can be found at ``/coverage/index.html``

# Front end

## Running tests
``npm test`` or ``npm run test`` starts app in test mode where all tests are run automatically, pressing ``w`` will return several options, including rerunning all tests, rerunning only failed tests or exiting test mode.

## Dependencies
### Environment
* Ubuntu 20.04.3
* Node 16.13.2
* NPM and React 8.6.0
* The production build uses the standard React buildpack.

### Production

* @date-io/moment:
Version of date-io that has been built around the momentjs date framework, is used to manage date creation and formatting on the front end
*@dnd-kit/core:
Core logic for dnd-kit that provides drag and drop functionality via the use of useDroppable and useDraggable hooks to mark components as either a droppable container or a draggable elemnt
* @dnd-kit/sortable:
An addon to dnd-kit/core that allows for a less detailed combined hook that also supports second dimentionall drag and drop making it possible to drag and drop grid items to any other location within the grid
* @dnd-kit/utilities:
Provides a variety of interesting tools that expand on smaller areas of dnd-kit, only used for dynamic styling changes inorder to improve the aesthetic of dragging and dropping components
* @emotion/styled:
Styling framework used by material ui to allow detailed inline styling of its components
* @emotion/react:
An expantion on the emotion styling framework to expand its functionality to JSX components
* @fontsource/roboto:
Default font framwork for material ui's typography component
* @mui/icons-material:
Material ui's icon library, grants access to wide range of unique and stylish icons that are used through the application
* @mui/material:
Material ui's core component, provides access to material ui's wide and useful variety of components to make styling easy and symple
* @mui/x-date-pickers:
Date-picker component from material ui, allows for a fancy calander element to be used for any date input, uses moment as a date framework.
* axios:
Acts as the middleware between the front end and back, provides extremely useful functionality for customising requests and responses while keeping it extremely simple and easy to understand
* bootstrap & react-bootstrap:
An additional styling framework that much like material ui provides a wide variety of components to smooth the styling process. Its navbar components is the core for user navigation through the app.
* form-data & form-data-extended:
form-data and its framework where essencial in being able to iron out image uploading, its added form-data-extended, particaly made it extremely simple and easy to construct objects and convert them to FormData just before making a request.
* moment:
Date framework used by material ui's Date-picker via @date-io
* react-router & react-router-dom:
React-router was used as the front end routing framework inorder to make maintaining local and global state simple and easy inorder to minimise the amount of requests that get made inorder to keep the variety of data updated.

### Development

* @testing-library:
This is the core testing framework that was used to write tests for the front end. Specifically /dom and /react allows for easy mimicing of a normal react evironment inorder to ensure tests are running as close to the real app as possible. /jest-dom and /user-event are also used for testing, making a variety of jest based functionality available and directly intigrated into the main @testing-library bundle, and user-event allows for a more detailed and accurate 'how a user would interect with a component' testing behaviour.
* jsdom & global-jsdom:
jsdom is a pure javascript testing environment seeking to emulate as much of a web browser environment inorder to maximise the validity of tests. global-jsdom specifically seperates jsdom from requiring a testing framework such as jest allowing it to run more freely no matter the environment
* jest:
Jest is an extremely useful framework for testing to keep on hand, allowing for advance system mocking or spying ability it was mostly used to delay a test untill the right opertune time inorder to prevent false failures
* msw:
MSW is a simple and easy way to mock network traffic, able to watch on a route, and mock a response in a far simpler and easy to impliment format than any other more general testing framework like jest
* react-test-renderer:
react-test-rendered is the core to react testing allowing for easy renderering of any react component no matter its possition in a DOM tree, it allows for a variety of tests to be performed directly on a react component or even simply mimic reacts render technoloy inorder to minimise test specific errors that can occured with a different in environment


# Known issues
* Devise inconsistently raises an error or exception if it is given unpermitted user params; it will not fail the operation and it will not use the unpermitted params, but it will sometimes not report that it got them either.
* db:seed contains calls against an API that will occasionally return invalid uris; when this occurs a crappy placeholder image is used
* dogs#show returns a pedigree object with value null as well as the real pedigree object as part of the dog
* Cannot unassign or reassign a puppy once assigned
* A dog can become its own ancestor since pedigree is not used for enforcement logic
* Manually setting the priority of a litter application to a value much higher than the number of applications on the waitlist will cause it to stop appearing in the UI
* The backend is hosted on a free dyno, so it may be asleep when the frontend queries it, which occasionally causes images to not load due to the URL being provided too slowly.
* Additionally the frontend sometimes gets sick of waiting for the backend to do something and decides it must have failed; for example sometimes during user signup.
* The custom domain is set up with a temporary redirect, so when it resolves the underlying netlify url will show.
* The three preceding issues are caused by the client failing to decide on and pay for hosting by the agreed date. The domain was even purchased at student expense because we get marked on that.

### Have an ERD that we did but never submitted
![An ERD that you're having since I made it](/newthings/erdv1.png)

# T3A2 Readme:
# Myshalair - a dog breeder's website

## Purpose

The purpose of this website is to have an online presence for a small business that breeds dogs. The owner of the business would like to have a website that allows her to maintain communication with other breeders and with owners of her stock so that she is better able to build a dog-based community.

## Functionality

The primary function of the website is to allow information about breeding dogs to be displayed. Litters produced by breeding dogs will automatically generate information for the puppies. Ownership of a puppy entitles an owner to maintain an account on the website and participate in forum discussions which function to permit the creation of a community. Future litters are also displayed on the website and have the function of allowing the expression of interest in their puppies by prospective customers, which in turn enables litter and customer allocation functionality.

Client rendering will occur for the display pages for dogs and litters, enabling richly animated and responsive user experiences. Server rendering will be used by exception.

## Target audience

People that like cocker spaniels and want to buy prize winning examples in the Brisbane area. One imagines mostly wealthy middle aged women, but one is only imagining.

## Tech stack

The website has a React front end, a Rails back end and a Postgres DB. Images are stored on Cloudinary and their implementation on the website is handled by the activestorage module of Rails. Payment will be handled by Stripe. The website will be hosted on a Heroku free instance during UAT, with the decision of whether to move it to a more robust instance and the provider of the instance to be made by the customer after UAT.

## Dataflow Diagram

![Data, flowing](/Resources/Dataflow/D2_DataFlow_Diagram.png)

## Application Architecture Diagram

![Application Architecture](/Resources/Architecture/D2_Architecture.svg)

## User Stories

### As the business owner I want to:
  List my breeding dogs and their details so that I communicate my pedigrees.
  Move breeding dogs to an inactive category when they are no longer breeding to ensure that only relevant information is shown.
  Create new breeding dog entries so that the website reflects the breeding opportunities I can offer.
  Show pictures of my past litters to help remember them.
  Show pictures of my past litters to help remember them and increase interest in my puppies.
  Show show results for dogs and litters so that people can be shown how successful my pedigrees are.
  
  Keep in touch with people who buy my dogs so that I can retain awareness of where my dogs end up.
  Build a user driver community so that I can increase dog breeding clout.
  Build a user driven community of people who own my dogs so that I can build brand reputation.
  Delete peoples’ posts to maintain decorum.
  Schedule future litters so that people know when they are coming.
  Schedule future litters so that prospective buyers know when they are coming.
  Allocate buyers to litters so that litters don’t become overbooked.
  Communicate with allocated buyers automatically so they know when scheduled litters are coming.
  Receive payment for puppies so that less cash is handled.
  Receive payment for puppies so that purchasing friction is reduced.
  Have a website that looks cooler than other breeders’ so that I can flex.
  Have a website with a good looking UI so that perceptions of my professionalism are enhanced.
  
  Screen potential buyers for suitability so that I can streamline my customer onboarding process.
  Retain the information of prospective and approved buyers so that I can contact them about future opportunities.


### As a prospective buyer I want to:
  Have a landing page with multiple pictures so that my attention is captured.
  Navigate the site from a single element so that I can find pages with information that interests me.
  See different breeding pairs and their previous litters so that I can assess the desirability of future litters.
  See the pedigrees of breeding dogs so that I can assess the desirability of future litters.
  See the show results of various pedigrees so that I can be assured that the stock is of good quality.
  Express my interest in buying a dog from a litter.
  See when litters are coming so that I can plan for the pickup of my puppy.


### As an owner I want to:
  Maintain communications with the breeder so I can access post-sale care and advice.
  Have the ability to send on-website direct messages to the breeder so that I can access post sale care and advice.
  See the read status of DMs so that I can see if there’s a communication problem.
  See a list of posts by other users organised by topic so that I can find threads I’m interested in.
  Make posts to start conversations about topics that interest me.
  Edit my posts so that I can fix errors.
  See when others have edited posts so I know they’re not being sneaky.
  Show off my dog’s show results to other owners so that I can feel pride.

## Wireframes

![Application Architecture](/Resources/Wireframes/AboutUs.png)

![Application Architecture](/Resources/Wireframes/BreedingSchedule.png)

![Application Architecture](/Resources/Wireframes/ContactForm.png)

![Application Architecture](/Resources/Wireframes/CreateDog.png)

![Application Architecture](/Resources/Wireframes/CreateLitter.png)

![Application Architecture](/Resources/Wireframes/CreateShow.png)

![Application Architecture](/Resources/Wireframes/Home.png)

![Application Architecture](/Resources/Wireframes/ListDogs_Litters.png)

![Application Architecture](/Resources/Wireframes/LitterInfo.png)

![Application Architecture](/Resources/Wireframes/LitterSignup.png)

![Application Architecture](/Resources/Wireframes/Login.png)

![Application Architecture](/Resources/Wireframes/ManageDogs.png)

![Application Architecture](/Resources/Wireframes/ManageLitters.png)

![Application Architecture](/Resources/Wireframes/ManageShows.png)

![Application Architecture](/Resources/Wireframes/PoliciesandSourcing.png)

![Application Architecture](/Resources/Wireframes/ShowResults.png)

![Application Architecture](/Resources/Wireframes/Signup.png)


## Workflow

![Application Architecture](/Resources/Workflow/220706Trello.jpg)

![Application Architecture](/Resources/Workflow/220711Trello.jpg)

![Application Architecture](/Resources/Workflow/220711TrelloP2.jpg)

![Application Architecture](/Resources/Workflow/220717Trello.png)
