const employeeModel = require('../models/employeesModel');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.getAllEmployees();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await employeeModel.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    const newEmployee = await employeeModel.createEmployee(employeeData);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error("ERROR CREATING EMPLOYEE:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updated = await employeeModel.updateEmployee(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    res.json({ message: 'Funcionário Atualizado com Sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchEmployee = async (req, res) => {
  try {
    const patched = await employeeModel.patchEmployee(req.params.id, req.body);
    if (!patched) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    res.status(201).json({ message: 'Funcionário modificado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deleted = await employeeModel.deleteEmployee(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    res.json({ message: 'Funcionário Deletado com Sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployeeByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email é necessário' });
    }

    const employee = await employeeModel.getEmployeeByEmail(email);
    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  patchEmployee,
  deleteEmployee,
  getEmployeeByEmail
};
