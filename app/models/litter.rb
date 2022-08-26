class Litter < ApplicationRecord
  belongs_to :breeder, class_name: 'User'
  belongs_to :sire, class_name: 'Dog'
  belongs_to :bitch, class_name: 'Dog'
  
  has_many :puppy_lists
  has_many :dogs, through: :puppy_lists
  
  accepts_nested_attributes_for :puppy_lists
  accepts_nested_attributes_for :dogs

  has_many :litter_applications

  has_one_attached :main_image, dependent: :purge
  has_many_attached :gallery_images, dependent: :purge

  scope :pleb, -> { where("status < 3")}

  def main_image_adder
    if self.main_image.present?
        self.as_json.merge({ main_image: self.main_image.url } )
      else
        self.as_json.merge({ main_image: nil })
    end
  end

end
