const prisma = require('./src/lib/prisma');

async function test() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('Testing create savingsGoal for user:', user.email);
    
    const goal = await prisma.savingsGoal.create({
      data: {
        name: 'Test Goal',
        targetAmount: 100000,
        currentAmount: 0,
        deadline: null,
        icon: 'Target',
        color: '#3b82f6',
        userId: user.id,
      },
    });

    console.log('Successfully created:', goal);

    await prisma.savingsGoal.delete({ where: { id: goal.id } });
    console.log('Successfully deleted');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
