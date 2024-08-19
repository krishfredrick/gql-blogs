import { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { User, Blog, Comment } from '../data'; 
export interface MyContext {
  dataSources: {
    User: User;
    Blog: Blog;
    Comment: Comment;
  };
  req: ExpressContextFunctionArgument['req'];
  res: ExpressContextFunctionArgument['res'];
  auth: boolean
}