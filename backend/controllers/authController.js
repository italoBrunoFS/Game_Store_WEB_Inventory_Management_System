const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const model = require('../models/employeesModel')


const login = async (req, res) => {
  try{
    const {email, senha} = req.body;

    const employee = await model.getEmployeeByEmail(email);
    if(!employee){
      return res.status(401).json({success: false, message: 'Usuário não encontrado'})
    }
    const isMatch = await bcrypt.compare(senha, employee.senha);
    if(!isMatch){
      return res.status(401).json({success: false, message: 'Credenciais Inválidas'})
    }
    const token = jwt.sign({id: employee.id_funcionario, role: employee.cargo}, process.env.JWT_SECRET, {expiresIn: '1d'})

    return res.status(200).json({success: true, message: 'Login Realizado com Sucesso', token, user: {id: employee.id_funcionario, name: employee.nome, email: employee.email, role: employee.cargo}})
  } catch (error){
    return res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {login};