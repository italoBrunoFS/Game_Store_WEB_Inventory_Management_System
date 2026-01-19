import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Toast = ({ text, type }) => {
  if (!text) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-black transition-all ${
        type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
      }`}
    >
      {text}
    </div>
  );
};

const Client = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf_cnpj: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
    bairro: "",
    rua: "",
    complemento: "",
    isFlamengo: 0,
    likeOnePiece: 0,
  });
  const [toast, setToast] = useState({ text: "", type: "" });

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clients", {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      showToast("Erro ao buscar clientes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "estado" && value.length > 2) return;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const showToast = (text, type) => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(
          `http://localhost:5000/clients/${editingClient.id_cliente}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } }
        );
        showToast("Cliente atualizado com sucesso!", "success");
      } else {
        await axios.post("http://localhost:5000/clients", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
        showToast("Cliente cadastrado com sucesso!", "success");
      }
      fetchClients();
      setEditingClient(null);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      showToast("Erro ao salvar cliente", "error");
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData(client);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      await axios.delete(`http://localhost:5000/clients/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      showToast("Cliente deletado com sucesso!", "success");
      fetchClients();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      showToast("Erro ao deletar cliente", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cpf_cnpj: "",
      email: "",
      telefone: "",
      cidade: "",
      estado: "",
      bairro: "",
      rua: "",
      complemento: "",
      isFlamengo: 0,
      likeOnePiece: 0,
    });
  };

  if (loading) return <p>Carregando clientes...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toast text={toast.text} type={toast.type} />

      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Gerenciar Clientes</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 max-w-5xl mx-auto">
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Nome", name: "nome", type: "text" },
            { label: "CPF/CNPJ", name: "cpf_cnpj", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Telefone", name: "telefone", type: "text" },
            { label: "Cidade", name: "cidade", type: "text" },
            { label: "Estado (2 letras)", name: "estado", type: "text" },
            { label: "Bairro", name: "bairro", type: "text" },
            { label: "Rua", name: "rua", type: "text" },
            { label: "Complemento", name: "complemento", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label className="block text-sm font-medium mb-1 text-gray-600">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleFormChange}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required={name !== "complemento"}
                maxLength={name === "estado" ? 2 : undefined}
              />
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isFlamengo"
              checked={formData.isFlamengo === 1}
              onChange={handleFormChange}
              className="form-checkbox h-5 w-5 text-red-500 cursor-pointer"
            />
            <label className="text-gray-700">É Flamengo?</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="likeOnePiece"
              checked={formData.likeOnePiece === 1}
              onChange={handleFormChange}
              className="form-checkbox h-5 w-5 text-yellow-500 cursor-pointer"
            />
            <label className="text-gray-700">Gosta de One Piece?</label>
          </div>

          <div className="col-span-2 flex space-x-2 mt-4 justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow-md cursor-pointer"
            >
              {editingClient ? "Atualizar Cliente" : "Cadastrar Cliente"}
            </button>
            {editingClient && (
              <button
                type="button"
                onClick={() => {
                  setEditingClient(null);
                  resetForm();
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded shadow-md cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">CPF/CNPJ</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Telefone</th>
              <th className="p-2 border">Cidade</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Bairro</th>
              <th className="p-2 border">Rua</th>
              <th className="p-2 border">Complemento</th>
              <th className="p-2 border">Flamengo?</th>
              <th className="p-2 border">One Piece?</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id_cliente} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{client.nome}</td>
                  <td className="p-2 border">{client.cpf_cnpj}</td>
                  <td className="p-2 border">{client.email}</td>
                  <td className="p-2 border">{client.telefone}</td>
                  <td className="p-2 border">{client.cidade}</td>
                  <td className="p-2 border">{client.estado}</td>
                  <td className="p-2 border">{client.bairro}</td>
                  <td className="p-2 border">{client.rua}</td>
                  <td className="p-2 border">{client.complemento}</td>
                  <td className="p-2 border">{client.isFlamengo ? "Sim" : "Não"}</td>
                  <td className="p-2 border">{client.likeOnePiece ? "Sim" : "Não"}</td>
                  <td className="p-2 border space-x-1">
                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(client.id_cliente)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="12">
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Client;
