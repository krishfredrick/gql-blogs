import { GraphQLError } from "graphql";
import { Like, Resolvers } from "../generated/graphql";

export const resolvers: Resolvers = {
  Query: {},
  Mutation: {
    async likeBlog(root, args, context, info) {
      try {
        // Attempt to like the blog
        const like = await context.dataSources.Like.likeBlog(args.blogId, context.req.user?.id);
    
        // Ensure that a valid Like object is returned
        if (!like) {
          throw new GraphQLError("Failed to like the blog", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
    
     
        return like as unknown as Like;
      } catch (error) {
        if (error instanceof Error) {
          // Log the error and throw a GraphQL error
          console.error(error.message);
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          });
        } else {
          // Handle unexpected error types
          throw new GraphQLError('An unknown error occurred', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          });
        }
      }
    },
    async unlikeBlog(root, args, context, info) {
      try {
        const blogId  = args.blogId, userId = context.req.user?.id;
        return await context.dataSources.Like.unlikeBlog(blogId, userId);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          });
        } else {
          throw new GraphQLError('An unknown error occurred', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          });
        }
      }
    },
  },
};
