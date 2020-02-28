# An article is a text composition which may be several paragraphs in length.
# Users may comment on an article and react in various ways.

#TODO: Implement eager loading / join so that reactions are grabbed in a single query
class Article  < ApplicationRecord
    validates :body, :title, presence: true

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

    has_many :smarts, as: :post, dependent: :destroy,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: "Smart"

    belongs_to :user,
    primary_key: :id,
    foreign_key: :user_id,
    class_name: "User"

    #Number of comments
    def count
        self.comments.size
    end

    #number of likes
    def like_count
        self.likes.size
    end

    #Returns user IDs of those who have liked - to be deprecated once "reactions" starts working well with Subscriptions
    def likers 
        self.likes.map {|like| like.user_id}
    end

    #Returns user IDs of those who found the article funny - to be deprecated once "reactions" starts working well with Subscriptions
    def laughers 
        self.funnies.map {|funny| funny.user_id}
    end

    #Returns user IDs of those who reacted "spicy" - to be deprecated once "reactions" starts working well with Subscriptions
    def burned
        self.spicies.map {|spicy| spicy.user_id}
    end

    def enlightened
        self.smarts.map {|smart| smart.user_id}
    end

    #Number of spicies. Seems to be required even when the field exists on the GraphQL type
     def spicy_count
        self.spicies.size
    end

    #Does what Facebook hates and returns comments in chronological order.
    def latest_comments
        self.comments.order(created_at: :desc)
    end

    #Work in progress, sends the count and reactions of an article to the front end to be displayed with appropriate icon based on type
    def reactions
       [
           {count: self.like_count, users: self.likers, type: "like"},
           {count: self.funnies.size, users: self.laughers, type: "funny"},
           {count: self.spicy_count, users: self.burned, type: "spicy"},
           {count: self.smarts.size, users: self.enlightened, type: "smart"}
       ]
    end
end