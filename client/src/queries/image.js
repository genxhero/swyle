import gql from "graphql-tag";

const image = gql`
    query image($id: Int!){
        image(id: $id){
            id
            title
            description
            image
            likers
            likeCount
            author {
                id
                username
            }
    },
      currentUser {
        id
      },
    imageIds
}
`

export default (image);