export const prisma = async()=> new (await import('@prisma/client')).PrismaClient() , PrismaConnect = ()=> prisma().then(prisma=> prisma.$connect);
