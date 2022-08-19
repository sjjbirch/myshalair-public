require 'uri'
require 'net/http'

if Dog.count == 0

  puts "Starting seeding..."

  counter = 0

  cnames = []
  20.times { cnames << Faker::Creature::Dog.unique.name }
  rnames = []
  20.times { rnames << Faker::Name.prefix + " " + Faker::Creature::Dog.meme_phrase + " " + Faker::Name.suffix }
  onames = []
  20.times { onames << Faker::Name.name }

  puts "Creating three users"
  
  user1 = User.new(username: Faker::Games::ElderScrolls.name, password: "qwerty", postcode:"2000", email: "1@qwerty.com", admin: true)
  user1.skip_confirmation!
  user1.save!
  puts "Created the user #{user1.username}"
  
  user2 = User.new(username: Faker::Games::ElderScrolls.name, password: "qwerty", postcode:"2000", email: "2@qwerty.com", admin: false)
  user2.skip_confirmation!
  user2.save!
  puts "Created the user #{user2.username}"
  
  user3 = User.new(username: Faker::Games::ElderScrolls.name, password: "qwerty", postcode:"2000", email: "3@qwerty.com", admin: false)
  user3.skip_confirmation!
  user3.save!
  puts "Created the user #{user3.username}"
  
  puts "Creating first two dogs to have litters"

  2.times do
    Dog.create(callname: cnames[counter], realname: rnames[counter], dob: 2200.days.ago, sex: counter + 1, ownername: 'Owner 1')
    puts "Created #{cnames[counter]}, more properly known as #{rnames[counter]}."
    counter += 1
  end

  puts "Creating Waitlist"
  Litter.create(lname: "FirstLitter", sire_id: 1, bitch_id: 2, breeder_id: 1, 
                pdate: rand(1900).days.ago, edate: rand(1900).days.ago,
                adate: rand(1900).days.ago, status: 1)

  puts "Creating a litter"

  litter1 = Litter.create(lname: "FirstLitter", sire_id: 1, bitch_id: 2, breeder_id: 1, 
                pdate: rand(1900).days.ago, edate: rand(1900).days.ago,
                adate: rand(1900).days.ago, status: 1)

  puts "saving a date"

  thebigdate = Litter.second.adate

  puts "A wonderful litter of 5 dogs was born on: " + thebigdate.to_s

  doglist = [
            [ 1, 'Larry Breeder' ],
            [ 2, 'Larry Breeder' ],
            [ 1, 'Hilaire Yeates' ],
            [ 1, 'Hilaire Yeates' ],
            [ 2, 'Some Farmer' ]
            ]

  doglist.each do | sex, breedername |
    dog = Dog.new(  
                  callname: cnames[counter], realname: rnames[counter], dob: thebigdate,
                  sex: sex, ownername: onames[counter], breedername: breedername
                  )
    dog.save!
    dog.move_to_top
    PuppyList.create!(litter: litter1, dog: dog)
    puts "#{rnames[counter]} better known as #{cnames[counter]} was born!"
    counter += 1
  end

  puts "But then there was a miracle and they had another litter 6 months later, with another 5 puppies!"

  thebigdate = thebigdate+130.days

  litter2 = Litter.create(
                          lname: "SecondLitter", sire_id: 1, bitch_id: 2, breeder_id: 1, 
                          pdate: thebigdate+50.days, edate: thebigdate+51.days,
                          adate: thebigdate+52.days, status: 1
                          )

  doglist = [
            [ 2, 'Han Solo' ],
            [ 1, 'George Lucas' ],
            [ 1, 'Walt Disney' ],
            [ 1, 'Some Seppo' ],
            [ 1, 'ABC Kids' ]
            ]

  doglist.each do | sex, breedername |
    dog = Dog.new( 
                  callname: cnames[counter], realname: rnames[counter], dob: thebigdate+52.days,
                  sex: sex, ownername: onames[counter], breedername: breedername
                  )
    dog.save!
    dog.move_to_top
    PuppyList.create!(litter: litter2, dog: dog)
    puts "#{rnames[counter]} better known as #{cnames[counter]} was born!"
    counter += 1
  end

  puts "Dogs created!"

  puts "But because the litters were so much fun, another one that was creepy and incestuous was planned..."

  litter3 = Litter.create(lname: "ThirdLitter", sire_id: 3, bitch_id: 2, breeder_id: 1, 
                pdate: rand(100).days.from_now, edate: rand(200).days.from_now, status: 1
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

  apps = LitterApplication.all
  apps.each do |app|
    app.move_to_bottom
  end

  puts "I wonder how the applications will be processed..."

  @dogs = Dog.all
  puts "Attempting to grab images...."
  uri = URI("https://dog.ceo/api/breed/spaniel/cocker/images/random/#{@dogs.count*3}")
  res = Net::HTTP.get_response(uri)
  if res.is_a?(Net::HTTPSuccess)
    parsed_res = JSON.parse(res.body)
    puts "Grabbed #{parsed_res.fetch("message").count} cocker-spaniel pictures."

    counter = 0

    @dogs.each do | dog |
      pic1 = URI.parse(parsed_res.fetch("message")[counter]).open
      dog.main_image.attach(io: pic1, filename: "foo.jpg")
      counter += 1
      puts "Added main image to #{dog.callname}"

      pic2 = URI.parse(parsed_res.fetch("message")[counter]).open
      dog.gallery_images.attach(io: pic2, filename: "foo.jpg")
      counter += 1
      puts "Added first gallery image to #{dog.callname}"

      pic3 = URI.parse(parsed_res.fetch("message")[counter]).open
      dog.gallery_images.attach(io: pic3, filename: "foo.jpg")
      counter += 1
      puts "Added second gallery image to #{dog.callname}"

    end

    puts "Images attached to dogs!"

  else
    puts "Couldn't grab images. Attaching placeholders instead."

    @dogs.each do | dog |
      dog.main_image.attach(io: File.open(Rails.root.join("app", "assets", "images", "dogplaceholder.png")),
      filename: 'dogplaceholder.png', content_type: 'image/png')
      puts "Attached an avatar picture to " + dog.callname

      dog.gallery_images.attach(io: File.open(Rails.root.join("app", "assets", "images", "gallery1.jpg")),
      filename: 'gallery1.jpg', content_type: 'image/jpg')
      puts "Attached first gallery picture to " + dog.callname

      dog.gallery_images.attach(io: File.open(Rails.root.join("app", "assets", "images", "gallery2.jpg")),
      filename: 'gallery2.jpg', content_type: 'image/jpg')
      puts "Attached second gallery picture to " + dog.callname
    end
  end

else

  puts "dogs already in database; seeding skipped"

end

puts "Database seeded for your pleasure!"