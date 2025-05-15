import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
    user: 'dbuser',
    host: 'db.retaildemo.net',
    database: 'demowebapp_prod_aws',
    password: 'CAdemo123',
    port: 5432,
});

export default db;