import argon from "argon2";
import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  ChangePasswordInput,
} from "../generated/graphql";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import crypto from "crypto";
import { db } from ".";
import { User as UserType } from "../generated/graphql";
import { Response } from "express";

export class User {
  private secret = process.env.SECRET || "";

  private hash(password: string) {
    return argon.hash(password);
  }

  private verify(hashedpassword: string, password: string) {
    return argon.verify(hashedpassword, password);
  }

  public createToken(
    payload: Partial<UserType>,
    expiresIn: number | string = "1m"
  ) {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  public verifyToken(token: string) {
    return jwt.verify(token, this.secret, { ignoreExpiration: true});
  }

  public async generateOTP(email: string) {
    const otp = crypto.randomInt(100000, 999999).toString();
    await this.updateOTP(email, otp);
    return otp;
  }

  public async verifyOTP(id: string, otp: string) {
    {
      const user = await this.getuserId(id);
      if (!user) {
        throw new GraphQLError("Invalid user ID");
      }

      const hashedOTP = await this.hash(otp);
      if (!this.verify(user.otp ?? "", hashedOTP)) {
        throw new GraphQLError("Invalid OTP");
      }

      return true;
    }
  }

  private async updateOTP(email: string, otp: string | null) {
    let hashedOTP: null | string = null;
    if (otp) {
      hashedOTP = await this.hash(otp);
    }
    return db.user.update({
      where: { email },
      data: { otp: hashedOTP },
    });
  }

  public async getuserId(id: string) {
    return db.user.findUnique({
      where: { id },
    });
  }

  public async getUserByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  }

  public async createUser(input: CreateUserInput) {
    console.log(12341243, "create user has hit");
    const hashedPassword = await this.hash(input.password);
    console.log("step 2 is hiting", 89010);
    return db.user.create({
      data: {
        email: input.email,
        name: input.name ?? null,
        password: hashedPassword,
        role: input.role ?? "USER",
      },
    });
  }

  // UPDATE USER
  public async updateUser(id: string, input: UpdateUserInput) {
    if (input.email) {
      const user = await this.getUserByEmail(input.email);
      if (user) {
        throw new GraphQLError(
          ` This email is already is in use by a user, if it was you please login`,
          {
            extensions: {
              code: "Forbidden",
            },
          }
        );
      }
      const oldUser = await this.getuserId(id);
      return db.user.update({
        where: { id },
        data: {
          email: input.email ?? oldUser?.email,
          name: input.name ?? oldUser?.name,
        },
      });
    }
  }

  // update RefreshToken on db
  private async updateRefreshToken(token: string, id: string) {
    return db.user.update({
      where: { id },
      data: { refreshToken: token },
    });
  }

  public async login(input: LoginInput, res: Response) {
    const user = await this.getUserByEmail(input.email);
    //  If user doens't exist
    if (!user) {
      throw new GraphQLError(
        `The user for this email does  not exist. Please login with proper email`,
        {
          extensions: {
            code: "Forbidden",
          },
        }
      );
    }

    const verify = await this.verify(user.password, input.password);
    if (!verify) {
      throw new GraphQLError(`Un Authorized entry`, {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    }

    const access_token = this.setCookie(res, {
        email: input.email,
        id: user.id,
      }),
      refresh_token = this.setCookie(
        res,
        { email: input.email, id: user.id },
        "refresh_token"
      );

    await this.updateRefreshToken(refresh_token, user.id);

    // If user does exist
    return {
      access_token,
      refresh_token,
    };
  }

  public async logout(res:Response, email:string){
    try {
      this.clearCookie(res, "access_token");
      this.clearCookie(res, "refresh_token");
      return db.user.update({
        where: { email },
        data: { refreshToken: null },
      }); 
    } catch (error) {
      throw new Error("Logout failed ")
    }
  }


  //  DELETE /USER
  public async deleteUser(id: string) {
    return db.user.delete({
      where: { id },
    });
  }

  public async changePassword(input: ChangePasswordInput) {
    return db.user.update({
      where: { id: input.id },
      data: {
        password: await this.hash(input.newPassword),
        otp: null,
      },
    });
  }

  // Get all user data
  public getAllUser(args?: unknown) {
    return db.user.findMany();
  }

  /************************************************************************************************
   *  Settings Cookies and Clearing Cookies
   *************************************************************************************************
   */

  public setCookie(
    res: Response,
    user: Partial<UserType>,
    cookieName: string = "access_token"
  ) {
    this.clearCookie(res, cookieName);
    const token =
      cookieName === "access_token"
        ? this.createToken(user)
        : this.createToken(user, "1d");
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "strict",
    });
    return token;
  }
  public clearCookie(res: Response, cookie: string = "access_token") {
    res.clearCookie(cookie);
  }
  public async refreshSession(token: string, res: Response) {
    const payload = this.verifyToken(token);
    if (!payload) {
      this.clearCookie(res, "refresh_token");
      throw new Error("Invalid or expired token");
    }
    this.setCookie(res, payload as JwtPayload as UserType);
    return payload as JwtPayload;
  }
}
