require "graphiql/rails"

Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  post "/graphql", to: "graphql#execute"
  mount ActionCable.server, at: '/cable'
  root :to =>  'index#index'
  # root to: redirect("/graphiql")
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
