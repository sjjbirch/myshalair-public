class User < ApplicationRecord
    has_secure_password
    validates :email, uniqueness: { case_sensitive: false }, presence: true
    validates :username, uniqueness: { case_sensitive: false }, presence: true
    validates :postcode, comparison: { greater_than: 999, less_than: 10000 }
    # function that validates the presence for all address items if and only if the other elements are present
end
