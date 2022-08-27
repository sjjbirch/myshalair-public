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

  puts "Creating five users"

  5.times do
    variable = counter.zero?
    if rand(100) > 15
       address1 = nil
    else
      address1 = Faker::Address.secondary_address
    end

    user = User.new(
      username: Faker::Games::ElderScrolls.name, firstname: Faker::Name.first_name, lastname: Faker::Name.last_name,
      address1: address1, address2: Faker::Address.street_address, suburb: "#{Faker::Address.city}, #{Faker::Address.state}",
      phonenumber: "04#{rand(10000000..30000000)}", password: "qwerty", postcode: rand(2000..6000).to_s, email: "#{counter+1}@qwerty.com", admin: variable)

      counter += 1

      user.skip_confirmation!
      user.save!
      puts "Created the user #{user.username}"

  end

  counter = 0
  
  puts "Creating first two dogs to have litters"

  2.times do
    Dog.create(callname: cnames[counter], realname: rnames[counter], dob: 2200.days.ago, sex: counter + 1, ownername: 'Owner 1')
    puts "Created #{cnames[counter]}, more properly known as #{rnames[counter]}."
    counter += 1
  end

  puts "Creating Waitlist"
  Litter.create(lname: "Waitlist", sire_id: 1, bitch_id: 2, breeder_id: 1, 
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
    PuppyList.create!(litter: Litter.second, dog: dog)
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
    PuppyList.create!(litter: Litter.third, dog: dog)
    puts "#{rnames[counter]} better known as #{cnames[counter]} was born!"
    counter += 1
  end

  puts "Dogs created!"

  puts "But because the litters were so much fun, another one that was creepy and incestuous was planned..."

  litter3 = Litter.create(lname: "ThirdLitter", sire_id: 3, bitch_id: 2, breeder_id: 1, 
                pdate: rand(100).days.from_now, edate: rand(200).days.from_now, status: 1
                )

  puts "Everyone really wanted Lannister puppies so they applied..."

  app1 = LitterApplication.create( user: User.second, litter: Litter.third, yardarea: 200.to_f, yardfenceheight: 5.to_f )
  Pet.create( litter_application: app1, age: 15, pettype: "Fish", petbreed: "Goldfish" )
  Pet.create( litter_application: app1, age: 160, pettype: "Fish", petbreed: "Great White Shark" )
  Child.create( litter_application: app1, age: 1 )
  
  litter = Litter.find(2)
  litter.puppy_lists.first.update!(litter_application_id: 1)
  

  app2 = LitterApplication.create( user: User.third, litter: Litter.fourth, yardarea: 205.to_f, yardfenceheight: 4.to_f )

  app3 = LitterApplication.create( user: User.third, litter: Litter.third, yardarea: 205.to_f, yardfenceheight: 4.to_f )

  app4 = LitterApplication.create( user: User.second, litter: Litter.second, yardarea: 200.to_f, yardfenceheight: 5.to_f )
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

    # parsed_res.fetch("message").each do |picurl|
    #   puts picurl
    #   puts picurl[-15..-1].parameterize
    # end

    counter = 0

    @dogs.each do | dog |
      puts "Microchipping #{dog.callname}"
      dog.update!(chipnumber: rand(100000000000000..900000000000000).to_s)
      begin
        url = parsed_res.fetch("message")[counter]
        pic1 = URI.parse(url).open
        dog.main_image.attach(io: pic1, filename: "#{url[-15..-1].parameterize}")
        puts "Added #{url[-15..-1].parameterize} as main image to #{dog.callname}"
      rescue
        dog.main_image.attach(io: File.open(Rails.root.join("app", "assets", "images", "dogplaceholder.png")),
        filename: 'dogplaceholder.png', content_type: 'image/png')
        puts "Attached a placeholder main image to " + dog.callname
      ensure
        counter += 1
      end
      
      begin
        url = parsed_res.fetch("message")[counter]
        pic2 = URI.parse(url).open
        dog.gallery_images.attach(io: pic2, filename: "#{url[-15..-1].parameterize}")
        puts "  Added #{url[-15..-1].parameterize} as first gallery image to #{dog.callname}"
      rescue
        dog.gallery_images.attach(io: File.open(Rails.root.join("app", "assets", "images", "dogplaceholder.png")),
        filename: 'dogplaceholder.png', content_type: 'image/png')
        puts "  Attached a placeholder first gallery image to " + dog.callname
      ensure
       counter += 1
      end

      begin
        url = parsed_res.fetch("message")[counter]
        pic3 = URI.parse(url).open
        dog.gallery_images.attach(io: pic3, filename: "#{url[-15..-1].parameterize}")
        puts "  Added #{url[-15..-1].parameterize} as second gallery image to #{dog.callname}"
      rescue
        dog.gallery_images.attach(io: File.open(Rails.root.join("app", "assets", "images", "dogplaceholder.png")),
        filename: 'dogplaceholder.png', content_type: 'image/png')
        puts "  Attached a placeholder second gallery image to " + dog.callname
      ensure
        counter += 1
      end

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

  @litters = Litter.all
  @litters.each do |litter|
    litter.main_image.attach(io: File.open(Rails.root.join("app", "assets", "images", "dogplaceholder.png")),
    filename: 'dogplaceholder.png', content_type: 'image/png')
    puts "Attached an avatar picture to litter number #{litter.id}"
  end

else

  puts "dogs already in database; seeding skipped"

end

puts "Database seeded for your pleasure!"