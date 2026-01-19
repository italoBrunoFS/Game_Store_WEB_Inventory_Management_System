import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Toast = ({ text, type, onClose }) => {
  if (!text) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-black transition-all ${
        type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
      }`}
    >
      {text}
      <button
        onClick={onClose}
        className="ml-4 font-bold hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });
  const [readonlyData, setReadonlyData] = useState({
    cpf_cnpj: "",
    cargo: "",
    salario: "",
    data_admissao: "",
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ text: "", type: "" });

  const fetchEmployee = async () => {
    try {
      let response;
      if (user?.id_funcionario) {
        response = await axios.get(`http://localhost:5000/employees/${user.id_funcionario}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      } else if (user?.email) {
        response = await axios.get(`http://localhost:5000/employees/by-email`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      }

      if (response?.data) {
        const { nome, email, telefone, cpf_cnpj, cargo, salario, data_admissao } = response.data;

        setFormData({ nome, email, telefone, senha: "" });
        setReadonlyData({
          cpf_cnpj: cpf_cnpj || "",
          cargo: cargo || "",
          salario: salario != null ? Number(salario).toFixed(2) : "",
          data_admissao: data_admissao || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      showToast("Erro ao carregar perfil.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (text, type) => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      };
      if (formData.senha) updateData.senha = formData.senha;

      await axios.patch(
        `http://localhost:5000/employees/${user.id}`,
        updateData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } }
      );
      showToast("Perfil atualizado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      showToast("Erro ao atualizar perfil.", "error");
    }
  };

  if (loading) return <p>Carregando perfil...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <Toast
        text={toast.text}
        type={toast.type}
        onClose={() => setToast({ text: "", type: "" })}
      />

      <h1 className="text-3xl font-bold mb-6 text-gray-700">Meu Perfil</h1>

      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded shadow-md w-full max-w-md grid gap-4"
      >
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleFormChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Telefone</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleFormChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Nova Senha</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleFormChange}
            placeholder="Preencha apenas se quiser alterar"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">CPF/CNPJ</label>
          <input
            type="text"
            value={readonlyData.cpf_cnpj}
            disabled
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Cargo</label>
          <input
            type="text"
            value={readonlyData.cargo}
            disabled
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Salário</label>
          <input
            type="text"
            value={readonlyData.salario ? `R$ ${readonlyData.salario}` : ""}
            disabled
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Data de Admissão</label>
          <input
            type="text"
            value={readonlyData.data_admissao}
            disabled
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer mt-2"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default Profile;
