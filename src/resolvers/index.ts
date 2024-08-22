import { Resolvers } from '../generated/graphql'
import { resolvers as userResolver } from './user.resolver'
import { resolvers as BlogResolver } from './blog.resolver'
import { resolvers as CommentResolver } from './comment.resolver'
import { resolvers as LikeResolver } from './likes.resolver'

const { Query: UserQuery, Mutation: UserMutation, ...UserOptions } = userResolver;
const { Query: BlogQuery, Mutation: BlogMutation, ...BlogOptions } = BlogResolver;
const { Query: CommentQuery, Mutation: CommentMutation, ...CommentOptions } = CommentResolver;
const { Query: LikeQuery, Mutation: LikeMutation, ...LikeOptions } = LikeResolver;


export const resolvers: Resolvers= {
  Query:{
    ...UserQuery,
    ...BlogQuery,
    ...CommentQuery,
    ...LikeQuery
  }, 
  Mutation:{
    ...UserMutation,
    ...BlogMutation,
    ...CommentMutation,
    ...LikeMutation
  },
  ...UserOptions,
  ...BlogOptions,
  ...CommentOptions,
  ...LikeOptions,
}