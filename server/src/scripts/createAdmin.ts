import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const createAdmin = async () => {
  try {
    const name = 'Shalanka Sathsara';
    const email = 'sbskithul@gmail.com';
    const password = 'sbskithul2000';

    const existing = await pool.query('SELECT * FROM users WHERE email = ', [email]);
    if (existing.rows.length > 0) {
      console.log('Admin with this email already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin') RETURNING user_id, name, email, role`,
      [name, email, passwordHash]
    );

    const admin = result.rows[0];
    console.log('Admin created successfully!');
    console.log('Name: ' + admin.name);
    console.log('Email: ' + admin.email);
    console.log('Role: ' + admin.role);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
