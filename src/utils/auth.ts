import { GraphQLError } from "graphql";
import { User } from "../data";
import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User as UserType } from '../generated/graphql'

const user = new User();

export const getUser = async (token: string, res: Response):  Promise<Partial<UserType> | JwtPayload | null> => {
  try {
    console.log("is hitting on utils");
    const email = user.verifyToken(token);
    return email as JwtPayload;
  } catch (error) {
    if (error instanceof Error && error.message === "jwt expired") {
      //  clearing the token once it  was expired on the cookie
      user.clearCookie(res);
      // note this is custom clearCookie method for clearing token
    }
    // throw new GraphQLError(` Token has expired Please initiate  a new one`, {
    //   extensions: {
    //     code: "UNAUTHORIZED",
    //   },
    // });
    return null;
  }
};
