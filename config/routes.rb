Rails.application.routes.draw do
  resources :litter_applications
  # get '/litter_breeder_check', to: 'litter_applications#match_breeder_and_litter'
  get '/applications_from_me', to: 'litter_applications#applications_for_user'
  get '/applications_to_me', to: 'litter_applications#applications_for_breeder'
  resources :litters

  # user pages
  devise_for :users, defaults: { format: :json }
  resources :users, defaults: { format: :json }

  # dog pages
  resources :dogs
  get '/boys', to: 'dogs#boys'
  get '/girls', to: 'dogs#girls'
  get '/puppies', to: 'dogs#puppies'

  # contact form pages
  # need to overwrite /contacts for unsigned post to /contact
  resources :contacts
  
  root to: 'dogs#index'

  #admin
  get '/userlist', to: 'admin#list_all_users'

end
