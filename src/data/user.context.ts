import argon  from "argon2";
// import {db} from "../prisma.client";
import  { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

export default class User {
  
  // private async db(){
  //   const connection = await db();
  //   return connection
  // }

  private hash(password: string){
    return argon.hash(password, {secret: process.env.SECRET})
  }

  private verify(hashedpassword: string, password: string){
    return argon.verify(hashedpassword, password);
  }

  public getuser(id: string){
    return db.users.findUnique({
      where:{

      }
    })
  }
}