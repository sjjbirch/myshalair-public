# README

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

#### gems test
*  gem 'capybara', '~> 2.4.4'
*  gem 'capybara-screenshot', '~> 1.0.11'
*  gem 'database_cleaner'
*  gem "rspec-rails", "~> 5.1"
*  gem "database_cleaner", "~> 2.0"
*  gem 'selenium-webdriver'

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

## Bugs
* Devise will not raise an error or exception if it is given unpermitted user params (at least on signup); it will not fail the operation and it will not use the unpermitted params, but it will not report that it got them either.
* 