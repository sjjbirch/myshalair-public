class Dog < ApplicationRecord
    include Rails.application.routes.url_helpers #to make url_for work

    after_create :append_healthtest

    acts_as_list

    belongs_to :owner, class_name: 'User'

    has_one_attached :main_image, dependent: :purge
    has_many_attached :gallery_images, dependent: :purge

    has_one :puppy_list
    has_one :litter, through: :puppy_list
    has_one :litter_application, through: :puppy_list
    
    accepts_nested_attributes_for :puppy_list, allow_destroy: true
    accepts_nested_attributes_for :litter

    has_one :healthtest, dependent: :destroy
    accepts_nested_attributes_for :healthtest, allow_destroy: true

    has_many :sired_litters, class_name: 'Litter', foreign_key: 'sire_id'
    has_many :bitched_litters, class_name: 'Litter', foreign_key: 'bitch_id'

    scope :puppers, -> {where('dob > ?', 12.weeks.ago)}
    scope :males, -> { where(sex: "1")}
    scope :females, -> { where(sex: "2")}
    scope :retired, -> { where(retired: true) }
    scope :displayed, -> {where(display: true)}

    def append_healthtest
    # Inputs:
    #   nil
    # Outputs:
    #   a new healthtest in the db associated with a just-created dog
    # called by:
    #   callbackfunction: after_create
    # Dependencies:
    #   nil
    # Supports feature:
    #   managing healthtest data
        @healthtest = self.build_healthtest(
            pra: 0, fn: 0,
            aon: 0, ams: 0,
            bss: 0
          )
        @healthtest.save
    end


    # helper methods
    def plebifier
    # Inputs:
    #   a dog class object
    # Outputs:
    #   returns the dog with only the fields a user should be allowed to see
    # called by:
    #   dog# boys girls retired displayed show puppies plebdex show
    # Dependencies:
    #   activerecord
    # Supports feature:
    #   showing dogs
    # Known issues:
    #   all of these model methods end up returning arrays not activerecord associations
    #   this is a problem since it means they can't chain which disallows dry code
    #   for eg main_image_adder is basically replicated in stripper because I can't call it
    #   without a nomethoderror since stripper returns an array
        self.stripper
    end

    def uri_adder
        # as above, but without restrictions so an admin can have everything
        self.main_image_adder
    end

    def main_image_adder
        if self.main_image.present?
            self.as_json.merge({ main_image: self.main_image.url } )
          else
            self.as_json.merge({ main_image: nil })
        end
    end

    def gallery_image_adder
        # I'm just not object oriented enough
        # returning arrays just crushed me here
    end

    def stripper
        if self.main_image.present?
            self.slice("id", "callname", "realname", "dob", "sex", "ownername", "position", "owner_id", "colour", "description", "retired", "display" )
                .as_json.merge({ main_image: self.main_image.url } )
          else
            self.slice("id", "callname", "realname", "dob", "sex", "ownername", "position", "owner_id", "colour", "description", "retired", "display" )
                .as_json.merge({ main_image: nil })
        end
    end

end
