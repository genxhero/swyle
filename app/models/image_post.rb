#An image post is what you might imagine - someone posts an image with a description and it gets
#TODO: make like count merely an integer for scaling reason

class ImagePost  < ApplicationRecord

    validates :title, presence: true


    #ImagePost takes on the name of post for the purposes of this association
    has_many :comments, as: :post, dependent: :destroy,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: "Comment"

    has_many :likes, as: :post, dependent: :destroy,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: "Like"

    has_many :funnies, as: :post, dependent: :destroy,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: "Funny"

    has_many :spicies, as: :post, dependent: :destroy,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: "Spicy"


    belongs_to :user,
    primary_key: :id,
    foreign_key: :user_id,
    class_name: "User"

    #Number of comments
    def count
        self.comments.size
    end

    #Ids of likers, used to check whether current user has already liked an image
    def likers 
        self.likes.map {|like| like.user_id}
    end
    #similar to Likers, returns ids of people who said "this article is spicy"
    def burned
        self.spicies.map {|spicy| spicy.user_id}
    end

    def spicy_count
        self.spicies.size
    end

    def like_count
        self.likes.size
    end
 
end