import { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { User, Blog, Comment, Like } from '../data'; 
import { User as UserType } from '../generated/graphql'
import { JwtPayload } from 'jsonwebtoken';
export interface MyContext {
  dataSources: {
    User: User;
    Blog: Blog;
    Comment: Comment;
    Like: Like
  };
  req: ExpressContextFunctionArgument['req'] & { user?: Partial<UserType> | JwtPayload | null };
  res: ExpressContextFunctionArgument['res'] & { user?: Partial<UserType>  | JwtPayload | null };
  auth: boolean
}