import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient(); // Sync initialization
export *  from './user.context';
export *  from './blog.context';
export *  from './comment.context'
