module Mutations
    class CreateSmart < BaseMutation    
        argument :post_type, String, required: true
        argument :user_id, Integer, required: true
        argument :post_id, Integer, required: true
        type Types::SmartType
        def resolve(user_id: nil, post_id: nil, post_type: nil)
            smart = Smart.new
            smart.user_id = user_id
            smart.post_id = post_id
            smart.post_type = post_type
            smart.save
            if post_type === "Article"
                article = Article.find(post_id.to_i)
                SwyleSchema.subscriptions.trigger("articleUpdated", {}, article)
            end
            if post_type === "ImagePost"
                image = ImagePost.find(post_id.to_i)
                SwyleSchema.subscriptions.trigger("imageUpdated", {}, image)
            end
            smart
        end
    end
  end