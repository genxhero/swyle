module Mutations
  class CreateArticle < BaseMutation
    argument :title, String, required: true
    argument :body, String, required: true
    
    type Types::ArticleType
    

    def resolve(title: nil, body: nil)
        snippet = body[0, 500]
        article = Article.new
        article.title =  title
        article.body = body
        article.snippet = snippet
        article.user = context[:current_user]
        
        if article.save 
#          SwyleSchema.subscriptions.trigger("articleAdded", {}, article)
           SwyleSchema.subscriptions.trigger("articleAdded", {}, Article.all)         
          # { article: article}
          article
        else
          { errors: article.errors.full_messages }
        end
    end

  end
end