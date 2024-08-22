import { GraphQLError } from "graphql";
import { Resolvers } from "../generated/graphql";
import DateConverter from "../utils/Date";
import { ensureAuthenticated } from "../utils/auth";

export const resolvers: Resolvers = {
  Query: {
    async comment(root, args, context, info) {
      try {
        ensureAuthenticated(context.auth);
        const comment = await context.dataSources.Comment.getCommentById(
          args.id
        );
        return DateConverter(comment);
      } catch (error) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
  },
  Mutation: {
    async createComment(root, args, context, info) {
      try {
        const userId = context.res.user?.id
        const comment = await context.dataSources.Comment.createComment(
          userId,
          args.input
        );
        return DateConverter(comment);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    async updateComment(root, args, context, info) {
      try {
        const comment = await context.dataSources.Comment.updateComment(
          args.id,
          args.input
        );
        return DateConverter(comment);
      } catch (error) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    async deleteComment(root, args, context, info) {
      try {
        const comment = await context.dataSources.Comment.deleteComment(
          args.id
        );
        return DateConverter(comment);
      } catch (error) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
  },

  
  Comment: {
    async author(root, args, context, info) {
      try {
        // console.log({ authorRoot: root });
        const author = await context.dataSources.User.getuserId(root?.authorId as string);
        // console.log({ author });
        if(!author) return null;
        return DateConverter(author);
      } catch (error) {
        console.log(error);
        throw new GraphQLError(
          error instanceof Error
            ? error.message
            : "Something crashed along in the process",
          {
            extensions: {
              code: error instanceof Error ? "DUNK IT" : "NOT_FOUND",
            },
          }
        );
      }
    },
    async blog(root, args, context, info) {
      try {
        // console.log({ blogRoot: root });

        const blog = await context.dataSources.Blog.getBlogById(root?.blogId as string);
        if(!blog) return null;
        return DateConverter(blog);
      } catch (error) {
        console.log(error);
        throw new GraphQLError(
          error instanceof Error
            ? error.message
            : "Something crashed along in the process",
          {
            extensions: {
              code: error instanceof Error ? "DUNK IT" : "NOT_FOUND",
            },
          }
        );
      }
    },
  },
};
