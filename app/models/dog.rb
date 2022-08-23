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
    scope :retired, -> { where(retired: true)}

    def append_healthtest
        @healthtest = self.build_healthtest(
            pra: 0, fn: 0,
            aon: 0, ams: 0,
            bss: 0
          )
        @healthtest.save
    end

    def uri_adder
        # called on a dog, returns the dog with the url for its profile picture as json
        self.main_image_adder

    end

    def main_image_adder
        if self.main_image.present?
            self.as_json.merge({ main_image: Rails.application.routes.url_helpers.url_for(self, :only_path => false, :host => "https://res.cloudinary.com")})
          else
            self.as_json.merge({ main_image: nil })
        end
    end

    def gallery_image_adder
    end

    # Rails.application.routes.url_helpers.product_url(self, :only_path => false, :host => "www.foo.com")

end
