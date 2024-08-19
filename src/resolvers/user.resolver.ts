import { GraphQLError } from "graphql";
import { Resolvers, Role } from "../generated/graphql";

export const resolvers: Resolvers = {
  Query: {},
  Mutation: {
    async register(root, args, context, info) {
      console.log({args});
     try {
       const user = await context.dataSources.User.createUser(args.input);
       console.log({user});
       if (!user) {
         throw new GraphQLError(`Something went wrong please try again`, {
           extensions: {
             code: "INTERNAL_SERVER_ERROR",
           },
         });
       }
       return {
         message: "registered Successfully",
         status: 201,
         success: true,
         data: {...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString(), role: user.role as Role}
       };
     } catch (error) {
      console.log(error);
      return {
        message: "Registration failed",
        status: 400,
        success: false,
      }
     }
    },
    async login(root, args, context, info){
      try{
       console.log("Does it ends on the resolvers?")
       const token = await await context.dataSources.User.login(args.input);
      // Set the token in the cookie
    context.res.cookie('token', token, {
      httpOnly: true, // recommended for security
      secure: process.env.NODE_ENV === 'production', // set to true in production
      sameSite: 'strict', // or 'Lax' depending on your needs
    });
    return token
        
      }catch(error){
        if (error instanceof Error) {
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

    }
  },
};
