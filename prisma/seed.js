import {
    PrismaClient
} from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    try {

        const users = await prisma.users.createMany({
            data: [
                {
                    name: "Azriel Fauzi Hermansyah",
                    email: "azrielfauzi23@gmail.com",
                    role: "admin",
                    status: "active"
                },
                {
                    name: "Ucup",
                    email: "ucup@gmail.com",
                    role: "user",
                    status: "active"
                },
            ]
        });

        const product = await prisma.product.createMany({
            data: [
                {
                    name: 'Meja',
                    price: 45000,
                },
                {
                    name: 'Kursi',
                    price: 50000,
                },
                {
                    name: 'Lemari',
                    price: 90000,
                }
            ]
        });

        console.log({
            users,
            product
        });
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();