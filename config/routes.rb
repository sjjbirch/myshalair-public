Rails.application.routes.draw do
  # dog pages
  resources :dogs
  
  get '/boys', to: 'dogs#boys'
  get '/girls', to: 'dogs#girls'
  get '/puppies', to: 'dogs#puppies'

  scope 'auth' do
    post '/signup', to: 'users#create'
    post '/signin', to: 'users#sign_in'
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
