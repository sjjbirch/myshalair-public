class ApplicationResponder < ActionController::Responder
  include Responders::FlashResponder
  include Responders::HttpCacheResponder

  # Redirects resources to the collection path (index action) instead
  # of the resource path (show action) for POST/PUT/DELETE requests.
  # include Responders::CollectionResponder

  module MyApplicationResponder
    protected
  
    def json_resource_errors #(passed: user_with_its_errors (is this to do?)
      {
        success: false,
        errors: MyApplicationErrorFormatter.call(resource.errors)
      }
    end
  end

end
