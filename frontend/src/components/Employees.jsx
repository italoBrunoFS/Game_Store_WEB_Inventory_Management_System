import { useEffect, useState } from "react";
import axios from "axios";

const Toast = ({ text, type }) => {
  if (!text) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg transition-all ${
        type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
      }`}
    >
      {text}
    </div>
  );
};

const formatDateToInput = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [toast, setToast] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    nome: "",
    cpf_cnpj: "",
    email: "",
    telefone: "",
    salario: "",
    data_admissao: "",
    senha: "",
    cargo: "",
  });

  const token = localStorage.getItem("pos-token");

  const api = axios.create({
    baseURL: "http://localhost:5000/employees",
    headers: { Authorization: `Bearer ${token}` },
  });

  const showToast = (text, type) => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3000);
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/");
      const data = res.data.map((emp) => ({
        ...emp,
        data_admissao: formatDateToInput(emp.data_admissao),
      }));
      setEmployees(data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      showToast("Erro ao buscar funcionários", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };

      if (editingEmployee) {
        await api.put(`/${editingEmployee.id_funcionario}`, payload);
        showToast("Funcionário atualizado com sucesso!", "success");
      } else {
        await api.post("/", payload);
        showToast("Funcionário cadastrado com sucesso!", "success");
      }

      fetchEmployees();
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      showToast("Erro ao salvar funcionário", "error");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      ...employee,
      data_admissao: formatDateToInput(employee.data_admissao),
      senha: "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este funcionário?")) return;
    try {
      await api.delete(`/${id}`);
      fetchEmployees();
      showToast("Funcionário deletado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      showToast("Erro ao excluir funcionário", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cpf_cnpj: "",
      email: "",
      telefone: "",
      salario: "",
      data_admissao: "",
      senha: "",
      cargo: "",
    });
  };

  return (
    <div className="p-6">
      <Toast text={toast.text} type={toast.type} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Funcionários</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Cadastrar Funcionário
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 border-r">ID</th>
                <th className="px-4 py-3 border-r">Nome</th>
                <th className="px-4 py-3 border-r">CPF/CNPJ</th>
                <th className="px-4 py-3 border-r">Email</th>
                <th className="px-4 py-3 border-r">Telefone</th>
                <th className="px-4 py-3 border-r">Salário</th>
                <th className="px-4 py-3 border-r">Data Admissão</th>
                <th className="px-4 py-3 border-r">Cargo</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id_funcionario} className="border-b hover:bg-gray-50 text-center">
                  <td className="px-4 py-3 border-r">{emp.id_funcionario}</td>
                  <td className="px-4 py-3 border-r">{emp.nome}</td>
                  <td className="px-4 py-3 border-r">{emp.cpf_cnpj}</td>
                  <td className="px-4 py-3 border-r">{emp.email}</td>
                  <td className="px-4 py-3 border-r">{emp.telefone}</td>
                  <td className="px-4 py-3 border-r">R$ {emp.salario}</td>
                  <td className="px-4 py-3 border-r">{emp.data_admissao}</td>
                  <td className="px-4 py-3 border-r">{emp.cargo}</td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id_funcionario)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingEmployee ? "Editar Funcionário" : "Cadastrar Funcionário"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {Object.keys(formData).map(
                (key) =>
                  key !== "id_funcionario" && (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {key.replace("_", " ")}
                      </label>
                      <input
                        type={
                          key === "senha"
                            ? "password"
                            : key === "salario"
                            ? "number"
                            : key === "data_admissao"
                            ? "date"
                            : "text"
                        }
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEmployee(null);
                    resetForm();
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
