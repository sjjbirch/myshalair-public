class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  has_one_attached :main_image, dependent: :purge

  has_many :litters_bred, class_name: 'Litter', foreign_key: 'breeder_id'
  has_many :owned_dogs, class_name: 'Dog', foreign_key: 'owner_id'

  has_many :litter_applications

  include Devise::JWT::RevocationStrategies::Allowlist

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :confirmable,
         :jwt_authenticatable, jwt_revocation_strategy: self

        # only jwt_auth, jwt_revoc, registerable, confirmable used
        # others there for later implementation

    validates :email, uniqueness: { case_sensitive: false }, presence: true
    validates :username, uniqueness: { case_sensitive: false }, presence: true

    def strip_user_jti
      # deprecated and unused
      self.slice("jti")
    end

end
