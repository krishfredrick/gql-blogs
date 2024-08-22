import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { Blog, Comment, User, Like } from "./data";
import { JwtPayload } from "jsonwebtoken";
import { User as UserType} from './generated/graphql'


export type DataSourceContext = {
  dataSources: {
   User: User,
   Blog: Blog,
   Comment: Comment,
   Like: Like
  };
  req: ExpressContextFunctionArgument['req'] &  { user?: Partial<UserType>  | JwtPayload | null };
  res: ExpressContextFunctionArgument['res'] & { user?: Partial<UserType>  | JwtPayload | null} ;
  auth: boolean
};