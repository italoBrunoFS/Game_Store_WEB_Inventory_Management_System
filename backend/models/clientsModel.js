const pool = require('../db/db');

async function getAllClients() {
  const [rows] = await pool.query('SELECT * FROM cliente');
  return rows;
}

async function getClientById(id) {
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);
  return rows[0];
}

async function createClient({
  nome,
  cpf_cnpj,
  email,
  telefone,
  cidade,
  estado,
  bairro,
  rua,
  complemento,
  isFlamengo,
  likeOnePiece
}) {
  const [result] = await pool.query(
    `INSERT INTO cliente 
     (nome, cpf_cnpj, email, telefone, cidade, estado, bairro, rua, complemento, isFlamengo, likeOnePiece) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nome,
      cpf_cnpj,
      email,
      telefone,
      cidade,
      estado,
      bairro,
      rua,
      complemento,
      isFlamengo ? 1 : 0,
      likeOnePiece ? 1 : 0
    ]
  );

  return {
    id: result.insertId,
    nome,
    cpf_cnpj,
    email,
    telefone,
    cidade,
    estado,
    bairro,
    rua,
    complemento,
    isFlamengo,
    likeOnePiece
  };
}

async function updateClient(id, {
  nome,
  cpf_cnpj,
  email,
  telefone,
  cidade,
  estado,
  bairro,
  rua,
  complemento,
  isFlamengo,
  likeOnePiece
}) {
  const [result] = await pool.query(
    `UPDATE cliente 
     SET nome = ?, cpf_cnpj = ?, email = ?, telefone = ?, cidade = ?, estado = ?, 
         bairro = ?, rua = ?, complemento = ?, isFlamengo = ?, likeOnePiece = ?
     WHERE id_cliente = ?`,
    [
      nome,
      cpf_cnpj,
      email,
      telefone,
      cidade,
      estado,
      bairro,
      rua,
      complemento,
      isFlamengo ? 1 : 0,
      likeOnePiece ? 1 : 0,
      id
    ]
  );

  return result.affectedRows > 0;
}

async function patchClient(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return false;

  let setClause = keys.map(k => `${k} = ?`).join(', ');

  const [result] = await pool.query(
    `UPDATE cliente SET ${setClause} WHERE id_cliente = ?`,
    [...values, id]
  );

  return result.affectedRows > 0;
}

async function deleteClient(id) {
  const [result] = await pool.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);
  return result.affectedRows > 0;
}

async function getClientByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM cliente WHERE email = ?', [email]);
  return rows[0];
}

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  patchClient,
  deleteClient,
  getClientByEmail
};
