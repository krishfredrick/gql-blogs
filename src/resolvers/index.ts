import { Resolvers } from '../generated/graphql'
import { resolvers as userResolver } from './user.resolver'

const { Query: UserQuery, Mutation: UserMutation, ...UserOptions } = userResolver;

export const resolvers: Resolvers= {
  Query:{
    ...UserQuery
  }, 
  Mutation:{
    ...UserMutation
  },
  
}