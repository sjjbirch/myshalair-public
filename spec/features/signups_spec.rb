require 'rails_helper'

RSpec.feature "Signups", type: :feature, js: true do

  name1 = Faker::Games::Dota.unique.player
  email1 = Faker::Internet.unique.email

  scenario "Visitor signs up for a new account" do
    visit("/signup")

    fill_in "username_id", with: name1
    fill_in "email_id", with: email1
    fill_in "epostcode_id", with: "2000"
    fill_in "password_id", with: "password1111"
    click_button "Sign Up"

    wait_for_page_load

    expect(page).to have_text("Please check emails for confirmation email")
  end

  scenario "Visitor signs up using existing username and email" do
    visit("/signup")

    fill_in "username_id", with: name1
    fill_in "email_id", with: email1
    fill_in "epostcode_id", with: "2000"
    fill_in "password_id", with: "password1111"
    click_button "Sign Up"

    wait_for_page_load

    text = page.driver.browser.switch_to.alert.text
    expect(text).to eq 'email has already been takenusername has already been taken'
    page.driver.browser.switch_to.alert.accept
  end

  scenario "Visitor signs up using existing email" do
    visit("/signup")

    fill_in "username_id", with: Faker::Games::Dota.unique.player
    fill_in "email_id", with: email1
    fill_in "epostcode_id", with: "2000"
    fill_in "password_id", with: "password1111"
    click_button "Sign Up"

    wait_for_page_load

    text = page.driver.browser.switch_to.alert.text
    expect(text).to eq 'email has already been taken'
    page.driver.browser.switch_to.alert.accept
  end

    scenario "Visitor signs up using existing username" do
    visit("/signup")

    fill_in "username_id", with: name1
    fill_in "email_id", with: Faker::Internet.unique.email
    fill_in "epostcode_id", with: "2000"
    fill_in "password_id", with: "password1111"
    click_button "Sign Up"

    wait_for_page_load

    text = page.driver.browser.switch_to.alert.text
    expect(text).to eq 'username has already been taken'
    page.driver.browser.switch_to.alert.accept
  end


  scenario "Visitor signs up using existing username" do
    visit("/signup")

    fill_in "username_id", with: name1
    fill_in "email_id", with: Faker::Internet.unique.email
    fill_in "epostcode_id", with: "2000"
    fill_in "password_id", with: "password1111"
    click_button "Sign Up"

    wait_for_page_load

    text = page.driver.browser.switch_to.alert.text
    expect(text).to eq 'username has already been taken'
    page.driver.browser.switch_to.alert.accept
  end

  scenario "User attempts to sign in without confirming email" do
    visit("/")
    click_link "Sign In"

    wait_for_page_load

    fill_in "email_id", with: email1
    fill_in "password_id", with: "password1111"
    click_button "Sign In"

    wait_for_page_load

    text = page.driver.browser.switch_to.alert.text
    expect(text).to eq 'You have to confirm your email address before continuing.'
    page.driver.browser.switch_to.alert.accept
  end

end
