import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const tbl_user = prisma.users;
const tbl_product = prisma.product;

export {
    prisma,
    tbl_product,
    tbl_user
};