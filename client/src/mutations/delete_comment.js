import gql from 'graphql-tag'

const deleteComment = gql`
mutation deleteComment($id: Int!)
 { deleteComment(id: $id) {
  id
}
  
}`