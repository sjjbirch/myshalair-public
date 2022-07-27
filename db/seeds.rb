# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

puts "Starting seeding..."

if Dog.count == 0

  puts "No dogs found in DB: Creating 10 dogs..."

  Dog.create(callname: 'Fido', realname: 'Fidolimus III', dob: rand(1900).days.ago, sex: 1, ownername: 'Owner 1',
            breedername: 'Larry Breeder')
  Dog.create(callname: 'Lassie', realname: 'Lassietudinal IV', dob: rand(1900).days.ago, sex: 2, ownername: 'Owner 2',
            breedername: 'Bob Breeder')
  Dog.create(callname: 'Redditor', realname: 'Cringelord I', dob: rand(1900).days.ago, sex: 1, ownername: 'Hilaire Yeates',
            breedername: 'Hilaire Yeates')
  Dog.create(callname: 'Barker', realname: 'Barks-at-2-am', dob: rand(1900).days.ago, sex: 1, ownername: 'Hilaire Yeates',
            breedername: 'The Dude')
  Dog.create(callname: 'Mog', realname: 'Mogdog', dob: rand(1900).days.ago, sex: 2, ownername: 'Solomon Birch',
            breedername: 'Some Farmer')
  Dog.create(callname: 'Princes Leia', realname: 'Kisses her brother', dob: rand(1900).days.ago, sex: 2,
            ownername: 'Han Solo', breedername: 'Darth Vader')
  Dog.create(callname: 'Sandman', realname: 'Even The Younglings', dob: rand(1900).days.ago, sex: 1,
            ownername: 'George Lucas', breedername: 'Luke Skinwalker')
  Dog.create(callname: 'Pluto', realname: 'Pluto The Pup', dob: rand(1900).days.ago, sex: 1, ownername: 'Walt Disney',
            breedername: 'Marv the Martian')
  Dog.create(callname: 'Red', realname: 'Red The Kelpie', dob: rand(1900).days.ago, 
            sex: 1, ownername: 'Some Seppo', breedername: 'Mongrel Man')
  Dog.create(callname: 'Blue', realname: "Children's Show Blue", dob: rand(1900).days.ago, sex: 1, ownername: 'ABC Kids',
            breedername: 'Animator Man')

  puts "Dogs created!"

  puts "Attaching placeholder main_image to each of the dogs (locally stored)..."

  @dogs = Dog.all

  @dogs.each do | dog |
    dog.main_image.attach(io: File.open(Rails.root.join("app", "assets", "images", "dogplaceholder.png")),
    filename: 'dogplaceholder.png', content_type: 'image/png')
  end

  puts "Images attached to dogs!"

else

  puts "dogs already in database, skipping dog creation"

end

puts "Database seeded for your pleasure!"