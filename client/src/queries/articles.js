import gql from 'graphql-tag';

const articles = gql`{
    articles{
        id
        title
        snippet
        author {
            id
            username
        }
    }
}`

export default articles;