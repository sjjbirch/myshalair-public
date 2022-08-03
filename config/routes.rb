Rails.application.routes.draw do
  
  # root, not important
  root to: 'dogs#index'
  
  # user pages
  devise_for :users, defaults: { format: :json }
  resources :users, defaults: { format: :json }
  
  resources :litters
  post '/add_puppy', to: 'litters#add_puppy'

  resources :litter_applications
  # get '/litter_breeder_check', to: 'litter_applications#match_breeder_and_litter'
  get '/applications_from_me', to: 'litter_applications#applications_for_user'
  get '/applications_to_me', to: 'litter_applications#applications_for_breeder'

  # dog pages
  resources :dogs
  get '/boys', to: 'dogs#boys'
  get '/girls', to: 'dogs#girls'
  get '/puppies', to: 'dogs#puppies'
  post '/add_p_to_l', to: 'dogs#add_p_to_l'

  # contact form pages
  # need to overwrite /contacts for unsigned post to /contact
  resources :contacts

  #admin
  get '/userlist', to: 'admin#list_all_users'

end
