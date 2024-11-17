const { readFileSync, rmSync, appendFileSync, existsSync } = require('fs');
const { faker } = require('@faker-js/faker');
const { Client } = require('pg'); // or your preferred DB library
const { chunk } = require('lodash');
const dotenv = require('dotenv');

dotenv.config({ path: `.env` });

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

async function generateUsers() {
  const numUsers = 10000;
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const registerDto = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
    };

    await fetch('http://localhost:3333/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerDto),
    }).then((res) => {
      users.push({
        email: registerDto.email,
        password: registerDto.password,
      });
    });
  }

  let csvData = 'email,password\n';
  csvData += users.map((u) => `${u.email},${u.password}`).join('\n');

  if (existsSync(`${__dirname}/users.csv`)) {
    rmSync(`${__dirname}/users.csv`);
  }

  appendFileSync(`${__dirname}/users.csv`, csvData);
}

async function deleteUsers() {
  try {
    if (!existsSync(`${__dirname}/users.csv`)) {
      return;
    }

    await client.connect();

    const csvData = readFileSync(`${__dirname}/users.csv`, 'utf-8');
    const emails = csvData.split('\n').map((line) => line.split(',')[2]);

    for (const emailChunk of chunk(emails, 1000)) {
      await client.query('DELETE FROM users WHERE email = ANY($1::text[])', [emailChunk]);
    }

    rmSync(`${__dirname}/users.csv`);
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
}

module.exports = { generateUsers, deleteUsers };
