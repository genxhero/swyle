# Description

Swyle is the newest contender in the blog posting world.  

[Live Demo](https://afternoon-eyrie-69554.herokuapp.com/)

# Features

## Image Post

A user may post an image together with a brief description if so desired.  The Rails model includes a link to an AWS bucket where the image is stored.

![alt text](https://i.imgur.com/HWlWEJE.png "Image Show")

![alt text](https://i.imgur.com/rdkLjZC.png "Image Index")

## Article Post

This is an option for all-text post - usually a story or a blog.  

![alt text](https://i.imgur.com/lSAnTao.png "Article")

## Comments

When logged in, a user may comment on a post.
![alt text](https://i.imgur.com/aAxm8Ru.png "Comments")

## Color Themes

Every user has a color scheme preference set at the model level. 

## User Authorization

Full registration and login functionality using bcrypt and the Rails auth pattern.
I ensure valid data is sent to the API with front-end validation.
![alt text](https://i.imgur.com/mWGzBVg.png "Front-End validation")

The error messages are a reusable react component of my own design. They receive two props: a string message, and a boolean that determines whether the component is visible when it renders.


```
const InlineError = props => {
    const {message, visible} = props;
    return (
        <span className="errors-inline" style={{"visibility":`${visible ? 'visible' : 'hidden'}`}}>
            <div className="error-tooltip-arrow"/><span className="error-message-inline">{message}</span>
        </span>
    )
}
```

## Demo Login Feature
![alt text](https://i.imgur.com/nvxKfDq.png "Demo Login")



## Reactions

Posts (articles only for the moment) can have many reactions (like, spicy, funny, and smart) that will update live on every user's client thanks to GraphQL subscriptions and the Rails ActionCable.

The Reaction component imports a number of [mutation strings](https://github.com/apollographql/graphql-tag) like the one below.

```
const likePost = gql`
mutation likePost($postType: String!, $userId: Int!, $postId: Int!) { 
        likePost(postType: $postType, userId: $userId, postId: $postId) {
            id
            liker{
                id
                username
            }
    }  
}
`;
```
The mutations are stored in JSON objects for O(1) access.  One constant stores mutations that create a new model, and the other stores mutations that destroy a model.  Additionally, because the Mutation can trigger the refetching of a query, we utilize another object that can be keyed into with the type of post.  A reaction also has a Font Awesome Icon that will vary depending on the type of reaction. 

```
const QUERIES = { "Article": article, "ImagePost": image };
const CREATE_MUTATIONS = {'like': likePost, 'funny': createFunny, 'smart': createSmart, "spicy": createSpicy}
const DELETE_MUTATIONS = {'like': unlikePost, 'funny': deleteFunny, 'smart': deleteSmart, "spicy": deleteSpicy}
const ICONS = { 'like': FaRegThumbsUp, 'funny': FaRegGrinSquint, 'smart': FaRegLightbulb, 'spicy': FaPepperHot}
```

In the component's render() we first check to see whether the current user has already reacted in this specific way to this specific given reaction - a user may find a post both funny and spicy, for example, but may not "like" a post twice.  The "users" prop contains an array of user ids against which the current user's ID will be checked.  The variables refetch, creation, and deletion are be set to the appropriate values based on the component's props.

```
      const userReacted = this.state.currentUser && this.props.users.includes(this.state.currentUser.id);
      const refetch = QUERIES[this.props.postType];
      const creation = CREATE_MUTATIONS[this.props.reactionType];
      const deletion = DELETE_MUTATIONS[this.props.reactionType];
      const Tag = ICONS[this.props.reactionType]
```
A ternary operation based on `userReacted` will determine the props of the Mutation component.  
``` <div className="reaction">
                    {userReacted ?
                        <Mutation
                            mutation={deletion}
                            refetchQueries={[{ query: refetch, variables: { id: this.props.postId, } }]}
                            update={(cache, { data: { deletion } }) => {
                            }}>
                  ...
 ```

In any event, when the icon gets clicked Apollo will make an HTTP request to the GraphQL controller and call the appropriate resolver.  For example, here is the resolver for the mutation that creates a new entry on the Likes table.  


```
def resolve(user_id: nil, post_id: nil, post_type: nil)
            like = Like.new
            like.user_id = user_id
            like.post_id = post_id
            like.post_type = post_type
            like.save
            if post_type === "Article"
                article = Article.find(post_id.to_i)
                SwyleSchema.subscriptions.trigger("articleUpdated", {}, article)
            end
            if post_type === "ImagePost"
                image = ImagePost.find(post_id.to_i)
                SwyleSchema.subscriptions.trigger("imageUpdated", {}, image)
            end
            like
        end
```

Most excitingly, after the new Like has been saved the function will trigger the subscription service.  (Please see the Live Updates section for additional details)

All reactions belong to a post, which may be of any sort (Articles and Images, possibly more in the future) using a polymorphic association.

```
class Like < ApplicationRecord

    validates :user_id, uniqueness: { scope: :post_id }
    
    belongs_to :post, polymorphic: true,
    primary_key: :id,
    foreign_key: :post_id

    belongs_to :user,
    primary_key: :id, 
    foreign_key: :user_id,
    class_name: "User"

end
```



## Live updates

This section is WIP, but here's a brief rundown: Swyle uses Redis, GraphQL Subscription, and the Rails ActionCable to provide live updates to articles, comments, and the index.

## Search

This was the first feature I implemented after I learned React Hooks.  (this section is under construction)

# Technologies Used

Ruby on Rails, GraphQL, Apollo Server, React, Node, Webpack, AWS.  Rails Action Cable and GraphQL Subscriptions are utilized to create an immersive blog experience featuring live updates.


# Future

## Known Issues

Heroku's Redis plugin is somewhat tempermental at the moment - as such websockets will occasionally fail during the handshake.

## New Features

### Tags
Posts may have a many-to-many relation with any number of tags; clicking on a tag will fetch articles that are linked to that tag on the join table.

### Videos
I hope to implement video uploads, or at least embedding.


## TODOS
*  Refactor all class components into functional components with  Hooks
*  Implement lazy loading or pagination or both
*  Change the -colorScheme to .colorScheme everywhere in the scss files and jsx elemental classNames
*  Create a reusable component to be used across the index, trending, and recent user posts. 
*  Implement rich text and formatting for articles.
*  Eager fetch reactions

# Bugs Overcome
*  Leaving the title edit component open and then navigating by way of the next / prev link will cause the mutation to apply to the image newly loaded regardless of owner. Expected behavior: it should close the edit components out. I solved this by entering logic in componentDidUpdate - should the paramaters change the component's state will update so that editingTitle and editingDescription are both false, thereby closing the editors.