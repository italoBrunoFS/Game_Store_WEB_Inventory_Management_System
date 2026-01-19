const pool = require('../db/db');
const bcrypt = require('bcrypt');

async function getAllEmployees() {
  const [rows] = await pool.query(
    `SELECT 
       id_funcionario, 
       nome, 
       cpf_cnpj, 
       email, 
       telefone, 
       salario, 
       DATE_FORMAT(data_admissao, '%d/%m/%Y') AS data_admissao, 
       senha, 
       cargo 
     FROM funcionario`
  );
  return rows;
}

async function getEmployeeById(id) {
  const [rows] = await pool.query(
    `SELECT 
       id_funcionario, 
       nome, 
       cpf_cnpj, 
       email, 
       telefone, 
       salario, 
       DATE_FORMAT(data_admissao, '%d/%m/%Y') AS data_admissao, 
       senha, 
       cargo 
     FROM funcionario 
     WHERE id_funcionario = ?`,
    [id]
  );
  return rows[0];
}

async function getEmployeeByEmail(email) {
  const [rows] = await pool.query(
    `SELECT 
       id_funcionario, 
       nome, 
       cpf_cnpj, 
       email, 
       telefone, 
       salario, 
       DATE_FORMAT(data_admissao, '%d/%m/%Y') AS data_admissao, 
       senha, 
       cargo 
     FROM funcionario 
     WHERE email = ?`,
    [email]
  );
  return rows[0];
}

async function createEmployee({ nome, cpf_cnpj, email, telefone, salario, data_admissao, senha, cargo }) {
  const hash = await bcrypt.hash(senha, 10);
  const [result] = await pool.query(
    `INSERT INTO funcionario (nome, cpf_cnpj, email, telefone, salario, data_admissao, senha, cargo) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, cpf_cnpj, email, telefone, parseFloat(salario), data_admissao, hash, cargo]
  );

  return { 
    id: result.insertId, 
    nome, cpf_cnpj, email, telefone, salario, data_admissao, cargo 
  };
}

async function updateEmployee(id, { nome, cpf_cnpj, email, telefone, salario, data_admissao, senha, cargo }) {
  let query = `
    UPDATE funcionario 
    SET nome = ?, cpf_cnpj = ?, email = ?, telefone = ?, salario = ?, data_admissao = ?, cargo = ?`;
  const params = [nome, cpf_cnpj, email, telefone, parseFloat(salario), data_admissao, cargo];

  if (senha) {
    const hash = await bcrypt.hash(senha, 10);
    query += `, senha = ?`;
    params.push(hash);
  }

  query += ` WHERE id_funcionario = ?`;
  params.push(id);

  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
}

async function patchEmployee(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return false;

  let setClause = keys.map(k => `${k} = ?`).join(', ');

  const senhaIndex = keys.indexOf('senha');
  if (senhaIndex !== -1) {
    values[senhaIndex] = await bcrypt.hash(values[senhaIndex], 10);
  }

  const [result] = await pool.query(
    `UPDATE funcionario SET ${setClause} WHERE id_funcionario = ?`,
    [...values, id]
  );

  return result.affectedRows > 0;
}

async function deleteEmployee(id) {
  const [result] = await pool.query('DELETE FROM funcionario WHERE id_funcionario = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  updateEmployee,
  patchEmployee,
  deleteEmployee
};
