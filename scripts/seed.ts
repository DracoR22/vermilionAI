const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: 'Solve your homeworks!'},
                { name: 'Financial advice'},
                { name: 'Health & Self-Care'},
                { name: 'Other'},
            ]
        })
    } catch (error) {
        console.error('Error seeding default categories')
    } finally {
        await db.$disconnect()
    }
}

main()