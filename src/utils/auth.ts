
import { User } from '../data';

const user = new User();

export const getUser = async(token: string)=>{
  console.log("is hitting on utils");
  const email =  user.verifyToken(token);
  console.log({email: email});
  return email;
} 