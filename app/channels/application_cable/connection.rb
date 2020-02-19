module ApplicationCable
  class Connection < ActionCable::Connection::Base
       identified_by :current_user

    def connect
      self.current_user = current_user
    end

    private

    def current_user       
      user = User.find_by(id: cookies.signed[:user_id])
      user 
    end

  end
end
