const express = require('express');
const request = require('supertest');
const app = require('./src/app');
const prisma = require('./src/lib/prisma');

async function test() {
  const user = await prisma.user.findFirst();
  const token = require('jsonwebtoken').sign({ id: user.id }, process.env.JWT_SECRET || 'finance_tracker_super_secret_key_2026', { expiresIn: '1h' });

  const res = await request(app)
    .post('/api/savings-goals')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: "Test API Goal",
      targetAmount: "100000",
      currentAmount: "",
      deadline: "",
      icon: "Target",
      color: "#3b82f6"
    });

  console.log('Status:', res.status);
  console.log('Body:', res.body);

  if (res.body.data && res.body.data.id) {
    await prisma.savingsGoal.delete({ where: { id: res.body.data.id } });
  }
}

test().catch(console.error).finally(() => prisma.$disconnect());
