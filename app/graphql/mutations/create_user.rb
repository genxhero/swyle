module Mutations
    class CreateUser < BaseMutation
      class AuthProviderSignupData < Types::BaseInputObject
        argument :email, Types::AuthProviderEmailInput, required: false
      end
  
      argument :username, String, required: true
      argument :auth_provider, AuthProviderSignupData, required: false
  
      field :token, String, null: true
      field :user, Types::UserType, null: true
      field :errors, [String], null: true

      def resolve(username: nil, auth_provider: nil)
        user = User.new(
          username: username.downcase,
          email: auth_provider&.[](:email)&.[](:email).downcase,
          password: auth_provider&.[](:email)&.[](:password)
        )
        if user.save
          # token = Jwt::TokenProvider.(user_id: user.id)
          # token = SecureRandom::urlsafe_base64
          context[:session][:session_token] = user.reset_token        
          context[:current_user] = user 
          context[:cookies].signed[:user_id] = user.id
          # This token is used exclusively for websockets
          token = SecureRandom::urlsafe_base64
          { user: user, token: token, errors: nil}
        else 
         { errors: user.errors.full_messages}
        end
      #end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid input: #{e.record.errors.full_messages.join(', ')}")
      end
    end#end of class 
  end #end of module