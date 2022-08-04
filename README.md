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
#### gems
* rails (7.0.3.1)
* image_processing (1.12.2)
* mini_magick (4.11.0)
* rspec-core (3.11.0)
* rack-cors (1.1.1)
* responders (3.0.1)
* net-http (0.2.2)
* acts_as_list (1.0.4)

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