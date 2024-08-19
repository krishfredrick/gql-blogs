import argon from "argon2";
import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  ChangePasswordInput
} from "../generated/graphql";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { db } from ".";

export  class User {

  private secret = process.env.SECRET || "";

  private hash(password: string) {
    return argon.hash(password);
  }


  private verify(hashedpassword: string, password: string) {
    return argon.verify(hashedpassword, password);
  }

  public createToken(payload: any) {
    return jwt.sign(payload, this.secret, { expiresIn: "2h" });
  }

  public verifyToken(token: string) {
    return jwt.verify(token, this.secret);
  }

  public async generateOTP(id: string) {
    const otp = crypto.randomInt(100000, 999999).toString();
    await this.updateOTP(id, otp);
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

  private async updateOTP(id: string, otp: string | null) {
    let hashedOTP: null | string = null;
    if (otp) {
      hashedOTP = await this.hash(otp);
    }
    return db.user.update({
      where: { id },
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

  public async login(input: LoginInput) {
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
    if(!verify){
      throw new GraphQLError(`Un Authorized entry`, {
        extensions: {
          code: "FORBIDDEN",
        },
      })
    }

    // If user does exist
    return this.createToken({ email: input.email });
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
      },
    })
  }


  // Get all user data
  public getAllUser(){
    return db.user.findMany();
  }

}
