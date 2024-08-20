import { GraphQLError } from "graphql";
import { Resolvers } from "../generated/graphql";
import DateConverter from "../utils/Date";

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
        const blog = await context.dataSources.Blog.createBlog(args.input);
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
};
