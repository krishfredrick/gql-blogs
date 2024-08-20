import { GraphQLError } from "graphql";
import { Resolvers } from "../generated/graphql";
import DateConverter from "../utils/Date";


export const resolvers: Resolvers ={
  Query:{
    async comment(root, args, context, info){
      try {
        const comment = await context.dataSources.Comment.getCommentById(args.id);
        return DateConverter(comment);
      } catch (error) {
       if(error instanceof Error){
        throw new GraphQLError(error.message, {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        })
       }
      }
    }
  },
  Mutation:{
    async createComment(root, args, context, info ){
      try {
        const comment = await context.dataSources.Comment.createComment(args.input);
        return DateConverter(comment);
      } catch (error) {
        if(error instanceof Error){
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          })
         }
      }
    }, 
    async updateComment(root, args, context, info){
      try {
        const comment = await context.dataSources.Comment.updateComment(args.id, args.input);
        return DateConverter(comment);
      } catch (error) {
        if(error instanceof Error){
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          })
         }
      }
    },
    async deleteComment(root, args, context, info){
      try{
        const comment = await context.dataSources.Comment.deleteComment(args.id);
        return DateConverter(comment);
      }catch(error){
        if(error instanceof Error){
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          })
        }
      }
    }
  }
}