Rails.application.routes.draw do
  
  # root, not important
  root to: 'dogs#index'
  
  # user pages
  devise_for :users, defaults: { format: :json }
  resources :users, defaults: { format: :json }
  
  resources :litters
  post '/add_puppy', to: 'litters#add_puppy'
  post '/add_puppies', to: 'litters#add_puppies'
  get '/showcase/:id', to: 'litters#showcase_litter'
  get '/showcase', to: 'litters#best'

  resources :litter_applications
  # get '/litter_breeder_check', to: 'litter_applications#match_breeder_and_litter'
  get '/applications_from_me', to: 'litter_applications#applications_for_user'
  get '/applications_to_me', to: 'litter_applications#applications_for_breeder'
  post '/lazy_litter_application_create', to: 'litter_applications#lazy_create'
  post '/add_pet', to: 'litter_applications#add_pet'
  post '/add_child', to: 'litter_applications#add_child'
  patch '/assign_puppy', to: 'litter_applications#assign_puppy'
  patch '/process_application', to: 'litter_applications#process_application'

  # dog pages
  resources :dogs
  get '/boys', to: 'dogs#boys'
  get '/girls', to: 'dogs#girls'
  get '/puppies', to: 'dogs#puppies'
  patch '/reorder_dogs', to: 'dogs#reorder_position'
  patch '/edit_healthtest', to:'dogs#healthtest_editor'
  post '/lazy_dog_create', to: 'dogs#lazy_dog_create'
  post '/find_dog', to: 'dogs#find_dog_by_chipnumber'

  # contact form pages, deprecated at client request
  # resources :contacts

  # admin
  get '/userlist', to: 'admin#list_all_users'

end
