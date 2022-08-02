Rails.application.routes.draw do
  resources :litter_applications
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
