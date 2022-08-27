require 'rails_helper'

RSpec.feature "Signups", type: :feature, js: true do

  names = []
  emails = []

  2.times do
    names << Faker::Games::Dota.unique.player
    emails << Faker::Internet.unique.email
  end

  fname = Faker::Name.first_name
  lname = Faker::Name.last_name

  scenario "Visitor signs up for a new account" do
    visit("/user/signUp")
    wait_for_page_load

    fill_in "username_id", with: names.first
    fill_in "email_id", with: emails.first
    fill_in "password_id", with: "password1111"
    fill_in "password_confirmation_id", with: "password1111"
    fill_in "phonenumber_id", with: "0412345678"
    fill_in "first_name_id", with: fname
    fill_in "last_name_id", with: lname
    fill_in "address_l1_id", with: "12 Street Address"
    fill_in "address_l2_id", with: "2nd line"
    fill_in "suburb_id", with: "Yokelton"
    fill_in "epostcode_id", with: "2000\n"

    # click_button "Sign Up"
    # the MUI implementation used for the sign up page breaks this and it can't be easily unbroken
    # basically MUI renders stuff in front fo the button and selenium is convinced the button can't be reached
    # without making breaking changes to capybara version there's no way to force this click, which a user can easily do
    # so instead a newline is included in the last field of the form to simulate hitting enter
    # also note that the richness of our failed user output has regressed on the 422 front.
    # We used to output and test better information that looked worse.

    wait_for_page_load
    wait_for_page_load
    wait_for_page_load
    wait_for_page_load
    wait_for_page_load

    expect(page).to have_text("Please check your emails")
  end

  scenario "Visitor signs up using existing username and email" do
    visit("/user/signUp")

    fill_in "username_id", with: names.first
    fill_in "email_id", with: emails.first
    fill_in "password_id", with: "password1111"
    fill_in "password_confirmation_id", with: "password1111"
    fill_in "phonenumber_id", with: "0412345678"
    fill_in "first_name_id", with: fname
    fill_in "last_name_id", with: lname
    fill_in "address_l1_id", with: "12 Street Address"
    fill_in "address_l2_id", with: "2nd line"
    fill_in "suburb_id", with: "Yokelton"
    fill_in "epostcode_id", with: "2000\n"

    wait_for_page_load
    wait_for_page_load
    wait_for_page_load
    wait_for_page_load
    wait_for_page_load

    expect(page).to have_text("422")
  end

  scenario "Visitor signs up using existing email" do
    visit("/user/signUp")

    fill_in "username_id", with: names.second
    fill_in "email_id", with: emails.first
    fill_in "password_id", with: "password1111"
    fill_in "password_confirmation_id", with: "password1111"
    fill_in "phonenumber_id", with: "0412345678"
    fill_in "first_name_id", with: fname
    fill_in "last_name_id", with: lname
    fill_in "address_l1_id", with: "12 Street Address"
    fill_in "address_l2_id", with: "2nd line"
    fill_in "suburb_id", with: "Yokelton"
    fill_in "epostcode_id", with: "2000\n"

    wait_for_page_load

    expect(page).to have_text("422")
  end

    scenario "Visitor signs up using existing username" do
      visit("/user/signUp")

      fill_in "username_id", with: names.first
      fill_in "email_id", with: emails.second
      fill_in "password_id", with: "password1111"
      fill_in "password_confirmation_id", with: "password1111"
      fill_in "phonenumber_id", with: "0412345678"
      fill_in "first_name_id", with: fname
      fill_in "last_name_id", with: lname
      fill_in "address_l1_id", with: "12 Street Address"
      fill_in "address_l2_id", with: "2nd line"
      fill_in "suburb_id", with: "Yokelton"
      fill_in "epostcode_id", with: "2000\n"

    wait_for_page_load

    expect(page).to have_text("422")
  end

  scenario "User attempts to sign in without confirming email" do
    visit("/")
    wait_for_page_load
    click_link "Sign In"

    fill_in "email_id", with: emails.first
    fill_in "password_id", with: "password1111"
    click_button "Sign In"

    

    wait_for_page_load

    expect(page).to have_text("You have to confirm")
  end

end
