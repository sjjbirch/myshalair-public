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

  Dog.create(callname: 'Fido', realname: 'Fidolimus III', dob: rand(1900).days.ago, sex: 1, owner: 'Owner 1',
             breeder: 'Larry Breeder')
  Dog.create(callname: 'Lassie', realname: 'Lassietudinal IV', dob: rand(1900).days.ago, sex: 2, owner: 'Owner 2',
             breeder: 'Bob Breeder')
  Dog.create(callname: 'Redditor', realname: 'Cringelord I', dob: rand(1900).days.ago, sex: 1, owner: 'Hilaire Yeates',
             breeder: 'Hilaire Yeates')
  Dog.create(callname: 'Barker', realname: 'Barks-at-2-am', dob: rand(1900).days.ago, sex: 1, owner: 'Hilaire Yeates',
             breeder: 'The Dude')
  Dog.create(callname: 'Mog', realname: 'Mogdog', dob: rand(1900).days.ago, sex: 2, owner: 'Solomon Birch',
             breeder: 'Some Farmer')
  Dog.create(callname: 'Princes Leia', realname: 'Kisses her brother', dob: rand(1900).days.ago, sex: 2,
             owner: 'Han Solo', breeder: 'Darth Vader')
  Dog.create(callname: 'Sandman', realname: 'Even The Younglings', dob: rand(1900).days.ago, sex: 1,
             owner: 'George Lucas', breeder: 'Luke Skinwalker')
  Dog.create(callname: 'Pluto', realname: 'Pluto The Pup', dob: rand(1900).days.ago, sex: 1, owner: 'Walt Disney',
             breeder: 'Marv the Martian')
  Dog.create(callname: 'Red', realname: 'Red The Kelpie', dob: rand(1900).days.ago, 
            sex: 1, owner: 'Some Seppo', breeder: 'Mongrel Man')
  Dog.create(callname: 'Blue', realname: "Children's Show Blue", dob: rand(1900).days.ago, sex: 1, owner: 'ABC Kids',
             breeder: 'Animator Man')

puts "Dogs created!"

puts "Attaching placeholder main_image to each of the dogs (locally stored)..."
    @dogs = Dog.all

    @dogs.each do | dog |
        dog.main_image.attach(io: File.open(Rails.root.join("app", "assets", "images", "dogplaceholder.png")),
        filename: 'dogplaceholder.png', content_type: 'image/png')
    end

puts "Images attached to dogs!"

end

puts "Database seeded for your pleasure!"