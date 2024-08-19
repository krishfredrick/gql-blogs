import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { Blog, Comment, User } from "./data";


export type DataSourceContext = {
  dataSources: {
   User: User,
   Blog: Blog,
   comment: Comment
  };
  req: ExpressContextFunctionArgument['req'];
  res: ExpressContextFunctionArgument['res'];
  auth: boolean
};