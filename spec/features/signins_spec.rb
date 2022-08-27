require 'rails_helper'

RSpec.feature "Signins", type: :feature, js: true do
    user = User.find_by( email: "1@qwerty.com" )

    unless !user.nil?
        user = User.new(username: "User1", password: "qwerty", postcode:"2000", email: "1@qwerty.com")
        user.skip_confirmation!
        user.save!
    end

    scenario "Wrong password" do

        visit("/")
        wait_for_page_load
        click_link "Sign In"
    
        fill_in "email_id", with: user.email
        fill_in "password_id", with: "asdaga"
        click_button "Sign In"
    
        wait_for_page_load

        # text = page.driver.browser.switch_to.alert.text
        # expect(text).to eq 'Invalid Email or password.'
        # page.driver.browser.switch_to.alert.accept
        # Old test for browser alert based messaging.

        expect(page).to have_text("Invalid Email or password")
   
    end

    scenario "Wrong username" do

        visit("/")
        wait_for_page_load
        click_link "Sign In"
        wait_for_page_load
    
        fill_in "email_id", with: "12@qwerty.com"
        fill_in "password_id", with: "qwerty"
        click_button "Sign In"
    
        wait_for_page_load

        # text = page.driver.browser.switch_to.alert.text
        # expect(text).to eq 'Invalid Email or password.'
        # page.driver.browser.switch_to.alert.accept

        expect(page).to have_text("Invalid Email or password")
    end

    scenario "Correct credentials" do

        visit("/")
        wait_for_page_load
        click_link "Sign In"
        wait_for_page_load
    
        fill_in "email_id", with: "1@qwerty.com"
        fill_in "password_id", with: "qwerty"
        click_button "Sign In"
    
        wait_for_page_load

        expect(page).to have_text(user.username)
    end

    scenario "sign out" do

        visit("/")
        wait_for_page_load
        click_link user.username
        wait_for_page_load
        click_link "Sign Out"
    
        wait_for_page_load

        expect(page).to have_text("Sign In")
    end

end
