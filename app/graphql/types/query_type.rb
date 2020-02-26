module Types
  class QueryType < Types::BaseObject
    field :articles, [ArticleType], null: false
    def articles
      Article.all.order(created_at: :desc)
    end

    field :article, ArticleType, null: false do
      argument :id, Int, required: true
    end
    #might not need these two fields any more 
    field :count, Integer, null: false
    field :likeCount, Integer, null: false
    field :reactions, [GraphQL::Types::JSON], null: true
    def article(argument)
     Article.find(argument[:id]).with(:likes, :smarts, :funnies, :spicies)
    end

    field :image, ImageType, null: false do
      argument :id, Int, required: true
    end
    def image(argument)
      ImagePost.find(argument[:id])
    end

    field :images, [ImageType], null: false
    def images
     ImagePost.all.order(created_at: :desc)
    end

    field :image_ids, [Integer], null: false
    def image_ids
      ImagePost.all.ids
    end

    field :user_by_id, UserType, null: false do 
      argument :id, Int, required: true
    end
    def user_by_id(argument)
      User.find(argument[:id].to_i)
    end

    field :user_by_username, UserType, null: false do 
      argument :username, String, required: true
    end
    def user_by_username(argument)
      User.find_by(username: argument[:username])
    end

    field :users, [UserType], null: false
    def users 
      User.all 
    end

    field :current_user, UserType, null: true 
    def current_user
      context[:current_user]
    end

    field :comments_by_post, [CommentType], null: true do
      argument :post_id, Integer, required: true
      argument :post_type, String, required: true
    end
    def comments_by_post(args)
      if args[:post_type] == "Article"
        Article.find(args[:post_id]).comments.order(created_at: :desc)
      elsif args[:post_type] == "ImagePost"
        ImagePost.find(args[:post_id]).comments.order(created_at: :desc)
      else
        raise "Invalid post type. How did you find this error? You must have some 1337 skill0rz"
      end 
    end

    field :comments_by_user, [CommentType], null: true do 
      argument :user_id, Integer, required: true
    end
    def comments_by_user(args)
      User.find(args[:user_id]).comments.order(created_at: :desc)
    end

    field :posts_by_user, [PostUnion], null: true do 
      argument :user_id, Integer, required: true
    end
    def posts_by_user(arg)
      
      user = User.find(arg[:user_id])
      recents = (user.articles + user.image_posts).sort_by { |k| k[:created_at] }
      recents
    end

    field :posts_by_popularity, [PostUnion], null: true
    def posts_by_popularity
      all_posts = Article.all + ImagePost.all
      all_posts.select {|post| post.like_count > 0 || post.count > 0}
    end

    field :posts_by_query, [PostUnion], null: true do
      argument :search_query, String, required: true
    end
    def posts_by_query(args)
      queries = args[:search_query].gsub("?q=", '').split(' ')
      posts = []
      queries.each do |query|
        posts += Article.where("lower(body) like ?", "%#{query.downcase}%").or(Article.where("lower(title) like ?", "%#{query.downcase}%"))
        posts += ImagePost.where("lower(description) like ?", "%#{query.downcase}%").or(ImagePost.where("lower(title) like ?", "%#{query.downcase}%"))
      end
      posts.uniq.sort_by { |k| k[:created_at] }
    end

  end #class end
end #module end 