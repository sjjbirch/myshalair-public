require "rails_helper"

RSpec.describe LitterApplicationsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/litter_applications").to route_to("litter_applications#index")
    end

    it "routes to #show" do
      expect(get: "/litter_applications/1").to route_to("litter_applications#show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/litter_applications").to route_to("litter_applications#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/litter_applications/1").to route_to("litter_applications#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/litter_applications/1").to route_to("litter_applications#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/litter_applications/1").to route_to("litter_applications#destroy", id: "1")
    end
  end
end
