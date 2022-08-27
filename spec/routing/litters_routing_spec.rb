require "rails_helper"

RSpec.describe LittersController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/litters").to route_to("litters#index")
    end

    it "routes to #show" do
      expect(get: "/litters/1").to route_to("litters#show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/litters").to route_to("litters#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/litters/1").to route_to("litters#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/litters/1").to route_to("litters#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/litters/1").to route_to("litters#destroy", id: "1")
    end
  end
end
