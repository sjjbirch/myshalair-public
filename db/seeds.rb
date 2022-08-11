# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

if Dog.count == 0

  puts "Starting seeding..."

  puts "Creating three users"
  
  user1 = User.new(username: "User1", password: "qwerty", postcode:"2000", email: "1@qwerty.com", admin: true)
  user1.skip_confirmation!
  user1.save!
  
  user2 = User.new(username: "User2", password: "qwerty", postcode:"2000", email: "2@qwerty.com", admin: false)
  user2.skip_confirmation!
  user2.save!
  
  user3 = User.new(username: "User3", password: "qwerty", postcode:"2000", email: "3@qwerty.com", admin: false)
  user3.skip_confirmation!
  user3.save!

  puts "No dogs found in DB"
  
  puts "Creating an Adamdog and an Evedog to have litters"

  dog1 = Dog.create(callname: 'Adam', realname: 'The First Dog', dob: 2200.days.ago, sex: 1, ownername: 'Owner 1')
  if dog1.save
    puts "created a dog"
  else
    puts dog1.errors.full_messages
  end
  # acts_as_list will create these at the top prio by default, but later we will move them

  Dog.create(callname: 'Eve', realname: 'Created From A Rib', dob: 2199.days.ago, sex: 2, ownername: 'Owner 1')
  
  puts "Creating a litter"

  litter1 = Litter.create(lname: "FirstLitter", sire_id: 1, bitch_id: 2, breeder_id: 1, 
                pdate: rand(1900).days.ago, edate: rand(1900).days.ago,
                adate: rand(1900).days.ago)

  puts "saving a date"

  thebigdate = Litter.first.adate

  puts "A wonderful litter of 5 dogs was born on: " + thebigdate.to_s

  doglist = [
            [ 'Fido', 'Fidolimus III', 1, 'Owner 1', 'Larry Breeder', 10 ],
            [ 'Lassie', 'Lassietudinal IV', 2, 'Owner 2', 'Larry Breeder', 9 ],
            [ 'Redditor', 'Cringelord I', 1, 'Hilaire Yeates', 'Hilaire Yeates', 8 ],
            [ 'Barker', 'Barks-at-2-am', 1, 'Hilaire Yeates', 'Hilaire Yeates', 7 ],
            [ 'Mog', 'Mogdog', 2, 'Solomon Birch', 'Some Farmer', 6 ]
            ]

  doglist.each do | cname, rname, sex, ownername, breedername, position |
    dog = Dog.new(  
                  callname: cname, realname: rname, dob: thebigdate,
                  sex: sex, ownername: ownername, breedername: breedername
                  )
    dog.save!
    dog.move_to_top
    PuppyList.create!(litter: litter1, dog: dog)
    puts cname + " was born!"
  end

  puts "But then there was a miracle and they had another litter 6 months later, with another 5 puppies!"

  thebigdate = thebigdate+130.days

  litter2 = Litter.create(
                          lname: "SecondLitter", sire_id: 1, bitch_id: 2, breeder_id: 1, 
                          pdate: thebigdate+50.days, edate: thebigdate+51.days,
                          adate: thebigdate+52.days
                          )

  doglist = [
            [ 'Princes Leia', 'Kisses her brother', 2, 'Han Solo', 'Darth Vader', 5 ],
            [ 'Sandman', 'Even The Younglings', 1, 'George Lucas', 'Luke Skinwalker', 4 ],
            [ 'Pluto', 'Pluto The Pup', 1, 'Walt Disney', 'Marv the Martian', 3 ],
            [ 'Red', 'Red The Kelpie', 1, 'Some Seppo', 'Mongrel Man', 2 ],
            [ 'Blue', "Children's Show Blue", 1, 'ABC Kids', 'Animator Man', 1 ]
            ]

  doglist.each do | cname, rname, sex, ownername, breedername, position |
    dog = Dog.new( 
                  callname: cname, realname: rname, dob: thebigdate+52.days,
                  sex: sex, ownername: ownername, breedername: breedername
                  )
    dog.save!
    dog.move_to_top
    PuppyList.create!(litter: litter2, dog: dog)
    puts cname + " was born!"
  end

  puts "Dogs created!"

  puts "Attaching locally stored placeholder main_image to each of the dogs..."

  puts "But because the litters were so much fun, another one that was creepy and incestuous was planned..."

  litter3 = Litter.create(lname: "ThirdLitter", sire_id: 3, bitch_id: 2, breeder_id: 1, 
                pdate: rand(100).days.from_now, edate: rand(200).days.from_now
                )

  puts "Everyone really wanted Lannister puppies so they applied..."

  app1 = LitterApplication.create( user: user2, litter: litter2, yardarea: 200.to_f, yardfenceheight: 5.to_f )

  Pet.create( litter_application: app1, age: 15, pettype: "Fish", petbreed: "Goldfish" )
  Pet.create( litter_application: app1, age: 160, pettype: "Fish", petbreed: "Great White Shark" )
  Child.create( litter_application: app1, age: 1 )

  app2 = LitterApplication.create( user: user3, litter: litter3, yardarea: 205.to_f, yardfenceheight: 4.to_f )

  app3 = LitterApplication.create( user: user3, litter: litter2, yardarea: 205.to_f, yardfenceheight: 4.to_f )

  app4 = LitterApplication.create( user: user2, litter: litter1, yardarea: 200.to_f, yardfenceheight: 5.to_f )

  Pet.create( litter_application: app4, age: 15, pettype: "Fish", petbreed: "Goldfish" )
  Pet.create( litter_application: app4, age: 160, pettype: "Fish", petbreed: "Great White Shark" )
  Child.create( litter_application: app4, age: 1 )

  puts "I wonder how the applications will be processed..."

  @dogs = Dog.all

  @dogs.each do | dog |
    dog.main_image.attach(io: File.open(Rails.root.join("app", "assets", "images", "dogplaceholder.png")),
    filename: 'dogplaceholder.png', content_type: 'image/png')
    puts "Attached a picture to " + dog.callname
  end

  puts "Images attached to dogs!"

else

  puts "dogs already in database; seeding skipped"

end

puts "Database seeded for your pleasure!"