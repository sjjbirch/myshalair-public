# README

## General:
Myshalair is a website for a champion cocker spaniel breeder to manager her customers and litters.

## Project management (PRG1006-2.3 Employ and utilise task delegation methodology):
The project kanban is at: https://trello.com/b/YpeL2Tbq/full-stack-app
Here's a picture of it ![I used to do this for money](/Resources/Workflow/projectmanagement.png). On the live board, everything to the left of "Current Sprint" is backlog, and everything to the right of "User User Stories" is dropped features.

The project was managed using an Agile methodology, with some some metamanagement done using PRINCE2.

Task delegation was conducted by Solomon. The frontend was mostly delegated to Will because he's better with JS and design. The backend was mostly done by Solomon because he's better with Ruby and DB. Deployment tasks were mostly done by Solomon because the customer knows him and she's going to try to rope him into doing permanent devops.

Tasks are tracked on the kanban, and are each tracked by importance and priority. Every US is extensively referenced in git commits. Each sprint collected synergistic user stories and had its own feature branch on git with many commits by each person. The total blame history is roughly 100 commits from Solomon and Will each across about 20 feature branches on the two public repos and 4 repos in total.

## Source control (PRG1006-2.1 Employ and utilise proper source control methodology):
### HD
The website has a git repo (P), a README and gitignore with appropriate content (C), more than 10 feature branches (D) with nearly 100 commits and half a dozen merge PRs from each team member (HD). And that doesn't even include the staging repos with the sexy upstream pulls and crazy merges.

## User and developer testing (PRG1006-7.1 Development testing && PRG1006-7.2 Production testing)
### Both HD
The site was staged two weeks in advance to permit developer and user testing. [Developer testing tracker](https://docs.google.com/spreadsheets/d/1OBxgfKiWAeLJSm13J-WUgnu3WHjyvQff2FXFoQ1FZZY/edit#gid=0) - see UAT linked user stories on Kanban for the extensive list of new features the client bestowed on us and features she asked for and that we'd already made that were dropped once she tried them and actually thought about what she wanted.

## Deployment (PRG1006-6.2 Deployment):
### HD
The frontend is deployed to Netlify and the backend and database to Heroku. The website can be accessed using the custom domain [Myshalair.com](https://www.myshalair.com/) however this is set up using a 302 temporary redirect because the client has not committed to a hosting solution. This means that the underlying frontend URL will be shown in the navbar after the page resolves. The website uses Cloudinary as a CDN for images. The back and front are both deployed from separate staging repos which are downstream of the main repos. This is so that we could share repos with educators without jeopordising the business operations of our customer.

The frontend is running on Ubuntu 20.04.3, Node 16.13.2, NPM and React 8.6.0, and the production build uses the standard React buildpack.
The backend is running on Ubuntu 20.04.4 LTS, Ruby 3.0.2p107 2021-07-07 rev 0db68f0233 and Rails 7.0.3.1.
The DB is running Ubuntu 20.04.4 LTS, PostgreSQL 14.0 build 1914.

## Testing (PRG1006-7.3 Utilises a formal testing framework):
### D
The backend has 20 unit tests and 2 feature integration tests using RSpec and Capybara driven by Selenium. The frontend uses Jest and has a half dozen unit tests. Testing instructions are below. It's actually unclear what the real code coverage is since we haven't taken the time to ignore the sections of the code base that are not relevant, but we're at least at D average.

## User interface (PRG1006-6.3 User interface):
### HD/D
The website uses MUI and extensive asynch calls to ensure an intuitive, clean and functional user interface. Of special note is the ability for the administrator to sort the display of dogs across all pages using a [special admin page](http://myshalair.com/dogs/re_order) where she can drag and drop dogs to set their priority for display. This was a challenging feature to implement but was necessary to ensure that there were no impediments to the workflow of the administrative user in carrying out complex operations.

## Functionality ( PRG1006-6.1 App functionality):
### HD
This website is so much more than my next door neighbour deserves. This should well and truly exceed her expectations.

## Functions (PRG1006-1.2 Demonstrate use of functions)
### HD
The commenting is gold standard with some super advanced stuff going on.

## Functions, ranges, classes (PRG1006-4.3 Utilises functions, ranges and classes)
### HD
Just look at the absolute chaddery in something as simple as seeds.rb, for example the use of classes, functions and ranges at ``phonenumber: "04#{rand(10000000..30000000)}"`` to generate random valid Australian mobile phone numbers is sophisticated and demonstrates exceptional understanding, or the entirity of the frontend litter update helper called ``updateItemInArray()`` found at ``src/Components/utils/helpers/generalTools.js`` which is used by ``src/Components/Pages/LitterRoute/LitterUpdate/LitterUpdate.js``, which is simply marvelous.

## Flow control (PRG1006-1.1 Demonstrate code flow control)
### HD
It's flawless.

## Libraries (CMP1043-1.3 Appropriate use of libraries used in the app)
### HD
See descriptions below.

## Other marking criteria
### ?
Yeah. About that.

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
* imagemagick (-v?) (os level, not gem)
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

## Known issues
* Devise inconsistently raises an error or exception if it is given unpermitted user params; it will not fail the operation and it will not use the unpermitted params, but it will sometimes not report that it got them either.
* db:seed contains calls against an API that will occasionally return invalid uris; when this occurs a crappy placeholder image is used
* dogs#show returns a pedigree object with value null as well as the real pedigree object as part of the dog
* Cannot unassign or reassign a puppy once assigned
* A dog can become its own ancestor since pedigree is not used for enforcement logic
* Manually setting the priority of a litter application to a value much higher than the number of applications on the waitlist will cause it to stop appearing in the UI
* The backend is hosted on a free dyno, so it may be asleep when the frontend queries it, which occasionally causes images to not load.
* Additionally the frontend sometimes gets sick of waiting for the backend to do something and decides it must have failed.
* The custom domain is set up with a temporary redirect, so when it resolves the underlying netlify url will show.
* The three preceding issues are caused by the client not wanting to pay for hosting. The domain was even purchased at student expense.

