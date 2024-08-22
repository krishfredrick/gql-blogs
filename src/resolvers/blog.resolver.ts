import { GraphQLError } from "graphql";
import { Resolvers } from "../generated/graphql";
import DateConverter from "../utils/Date";
import { ensureAuthenticated } from "../utils/auth";

export const resolvers: Resolvers = {
  Query: {
    async blogs(root, args, context, info) {
      try {
        // Fetch blogs from the data source
        const blogs = await context.dataSources.Blog.getAllBlogs(args);
  
        return (blogs ?? []).map(blog => DateConverter(blog));
      } catch (error) {
        console.error(error);
        throw new GraphQLError('Failed to fetch blogs', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
    async blog(root, args, context, info) {
      try {
        const blog = await context.dataSources.Blog.getBlogById(args.id);
        return DateConverter(blog);
      } catch (error) {
        console.error(error);
        throw new GraphQLError('Failed to fetch blog', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
  },
  Mutation: {
    async createBlog(root, args, context, info) {
      try {
        ensureAuthenticated(context.auth);
        const userId = context.res.user?.id;
        console.log(userId);
        const blog = await context.dataSources.Blog.createBlog(userId, args.input);
        return DateConverter(blog);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    async updateBlog(root, args, context, info) {
      try {
        const blog = await context.dataSources.Blog.updateBlog(
          args.id,
          args.input
        );
        return DateConverter(blog);
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
    async deleteBlog(root, args, context, info) {
      try {
        const blog = await context.dataSources.Blog.deleteBlog(args.id);
        return DateConverter(blog);
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
  Blog:{
    async comments(root, args, context, info){
      const comments  = await context.dataSources.Comment.getCommentsByBlogId(root.id);
      return (comments?? []).map(comment => DateConverter(comment));
    }
  },


};
