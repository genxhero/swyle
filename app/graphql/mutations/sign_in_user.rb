module Mutations
    class SignInUser < BaseMutation

      null true
  
      argument :email, Types::AuthProviderEmailInput, required: false
  
      field :token, String, null: true
      field :user, Types::UserType, null: true

      def resolve(email: nil)
        return unless email
        user = User.find_by email: email[:email].downcase
        if user && user.authenticate(email[:password])
          puts "Authentication SUCCESS FOR #{user.username}"
          puts "Before Reset: #{context[:session][:session_token] } User's: #{user.session_token}"
          context[:session][:session_token] = user.reset_token        
          context[:current_user] = user 
          context[:cookies].signed[:user_id] = user.id
          puts "After Reset: #{context[:session][:session_token]} User's: #{user.session_token}"
          # This token is used exclusively for websockets
          token = SecureRandom::urlsafe_base64
          { user: user, token: token }
        else
         { errors: ["Invalid credentials; username or password is incorrect"]}
        end
      end


    end
  end