import { GraphQLError } from "graphql";
import { Resolvers, Role, User } from "../generated/graphql";
import { sendEmail } from "../services/aws-ses";
import DateConverter from "../utils/Date";
import { ensureAuthenticated } from "../utils/auth";

export const resolvers: Resolvers = {
  Query: {
    async user(root, args, context, info) {
      try {
        let user;
        if (args.userInput.email) {
          let result = await context.dataSources.User.getUserByEmail(
            args.userInput.email
          );
          user = DateConverter(result);
        } else {
          let result = await context.dataSources.User.getuserId(
            args.userInput.id as string
          );
          user = DateConverter(user);
        }
        return user;
      } catch (error) {
        if(error instanceof Error) {
          console.error(error.message);
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    async users(root, args, context, info) {
      try {
        let users = await context.dataSources.User.getAllUser(args);
        users = users ?? [];
        return users.map(user => DateConverter(user));
      } catch (error) {
        console.log(error);
    
        if (error instanceof Error) {
          console.error(error.message);
    
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        } else {
          throw new GraphQLError("An unknown error occurred", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    async logout(root, args, context, info){
      try {
        ensureAuthenticated(context.auth);
        await context.dataSources.User.logout(context.res, context.res.user?.email);
        return " Logged out successfully"
      } catch (error) {
        if(error instanceof Error ){
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          })
        }else{
          throw new GraphQLError("An unknown error occurred on logout", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    }
    
  },
  Mutation: {
    async register(root, args, context, info) {
      console.log({ args });
      try {
        const user = await context.dataSources.User.createUser(args.input);
        // We assume once the user is account is created we are logging him in
        await context.dataSources.User.login({email: args.input.email, password: args.input.password}, context.res);
        console.log({ user });
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
          data: {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            role: user.role as Role,
          },
        };
      } catch (error) {
        console.log(error);
        return {
          message: "Registration failed",
          status: 400,
          success: false,
        };
      }
    },
    async login(root, args, context, info) {
      try {
        console.log("Does it ends on the resolvers?");
        if(context.auth){
          throw new GraphQLError(` Already logged in`, {
            extensions: {
              code: "ALREADY_LOGGED_IN",
              statusbar: "ERROR",
            },
          })
        }
        const {refresh_token, access_token} = await context.dataSources.User.login(args.input, context.res);

        return { refresh_token, access_token};
      } catch (error) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        } else {
          // Handle unexpected error types
          throw new GraphQLError("An unknown error occurred", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
    },
    async otp(root, args, context, info) {
      try {
        const otp = await context.dataSources.User.generateOTP(
          args.email as string
        );
        console.log({ otp });
        await sendEmail(otp);
        return "Please check your email and enter otp here";
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        return "OTP Generation is Failed due to some unknown reason";
      }
    },
    async changePassword(root, args, context, info) {
      try {
        return "Successfully changed your password";
      } catch (error) {
        return " Failed to change your password";
      }
    },
  },
 
};
