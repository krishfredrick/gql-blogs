export const db = async()=> new (await import('@prisma/client')).PrismaClient() , PrismaConnect = ()=> db().then(prisma=> prisma.$connect);
