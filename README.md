# README

## Usage
### To test:
* Install environment, dependencies and bundle install.
* If you are feeling extremely risky then add ``api: RAILS_ENV=test bundle exec rails s -p 3001`` to ``procfile-react-test``, and then run ``foreman start -f procfile-react-test``, but be aware that that foreman seems not to consistently kill Puma servers and you may need to manually troubleshoot if this occurs.
* If you aren't feeling risky then just run ``foreman start -f procfile-react-test`` and in another terminal run ``RAILS_ENV=test bundle exec rails s -p 3001``.
* Either way, run ``bundle exec rspec spec`` to run the integration and unit tests.

* If you're feeling ultra risky then add ``batch_test: sleep 4 && bundle exec rspec spec`` after ``api: `` and then start foreman. This seems to run once and once only without manual troubleshooting.
* If you'd like this issue to be addressed, please go and comment on the [pull request to fix it that's been open for a year even though it has no conflicts](https://github.com/ddollar/foreman/pull/780).

## Config notes
* Dev DB username:postgres pw:postgres port:5432 on localhost
* Web server = puma, listening on port 3001
* Sprint 1.1: Added DB table for dogs, added main_image attachment to dogs prefilled with placeholder image. Seeded 10 dogs.
* config defauls for rails 7 and autoload = :classic (for compatibility with knock)
### Dependencies
#### os env stuff
* ubuntu 20.04.4 LTS
* imagemagick (-v?) (os level, not gem)
* ruby 3.0.2p107 2021-07-07 rev 0db68f0233
* foreman -0.87.2 (environment, NOT Rails, for testing only; ie gem install foreman NOT in the gemfile)

#### gems
* rails (7.0.3.1)
* image_processing (1.12.2)
* mini_magick (4.11.0)
* rack-cors (1.1.1)
* responders (3.0.1)
* net-http (0.2.2)
* acts_as_list (1.0.4)
* gem 'cloudinary'

#### gems test
*  gem 'capybara', '~> 2.4.4'
*  gem 'capybara-screenshot', '~> 1.0.11'
*  gem 'database_cleaner'
*  gem "rspec-rails", "~> 5.1"
*  gem "database_cleaner", "~> 2.0"
*  gem 'selenium-webdriver'
*  gem 'simplecov'
*  gem 'webrick' (in all env but for test funcs)
*  gem 'webdrivers', '~> 5.0' (in all env but for test funcs)

I'm so sad that I've installed Capybara. Last time I tried to use it I spent a week trying to make it work and succeeded only in disappointing myself.

## Maintenance notes
* bcrypt
* devise
* devise-jwt

## To do
### Placeholders
* Postcode validation function in user model
* create and checkpedigree methods in healthtest controller

### Outstanding
* user controller missing function to validate address fields if user has entered some address info in signup
* dogs currently missing owner and breeder fields to link them to users

## Known issues
* Devise will not raise an error or exception if it is given unpermitted user params (at least on signup); it will not fail the operation and it will not use the unpermitted params, but it will not report that it got them either.
* db:seed contains calls against an API that will occasionally return invalid uris; when this occurs the seed will not complete and will exit with an error, requiring the DB to have its attachments purged and then be reset again. This is easily fixable but is a very low priority since it only affects dev experience.
* dogs#show returns a pedigree object with value null
* Cannot unassign or reassign a puppy once assigned
* Applications once assigned to a litter can only be returned to the waitlist with status rejected
* A dog can become its own ancestor since pedigree is not used for enforcement logic