import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    nome: "",
    tipo: "",
    preco_min: "",
    preco_max: "",
    fabricado_em: "",
    estoque_min: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    fabricante: "",
    preco: "",
    descricao: "",
    quantidade_estoque: "",
    garantia_meses: "",
    fabricado_em: "",
  });

  const [toast, setToast] = useState({ text: "", type: "" });

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products", {
        params: {
          nome: filters.nome || null,
          tipo: filters.tipo || null,
          preco_min: filters.preco_min ? parseFloat(filters.preco_min) : null,
          preco_max: filters.preco_max ? parseFloat(filters.preco_max) : null,
          fabricado_em: filters.fabricado_em || null,
          estoque_min: filters.estoque_min ? 5 : null,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      showToast("Erro ao buscar produtos.", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        nome: "",
        tipo: "",
        fabricante: "",
        preco: "",
        descricao: "",
        quantidade_estoque: "",
        garantia_meses: "",
        fabricado_em: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const showToast = (text, type) => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3000);
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/products/${editingProduct.id_produto}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } }
        );
        showToast("Produto atualizado com sucesso!", "success");
      } else {
        await axios.post("http://localhost:5000/products", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
        showToast("Produto cadastrado com sucesso!", "success");
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      showToast("Erro ao salvar produto.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await axios.delete(`http://localhost:5000/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      fetchProducts();
      showToast("Produto deletado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      showToast("Erro ao deletar produto.", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Produtos</h1>

      {toast.text && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 transition-all ${
            toast.type === "success"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4">
        <input
          type="text"
          name="nome"
          placeholder="Buscar por nome"
          value={filters.nome}
          onChange={handleFilterChange}
          className="border p-2 rounded w-48"
        />

        <select
          name="tipo"
          value={filters.tipo}
          onChange={handleFilterChange}
          className="border p-2 rounded w-48"
        >
          <option value="">Todas as categorias</option>
          <option value="jogo">Jogo</option>
          <option value="console">Console</option>
          <option value="acessorio">Acessório</option>
        </select>

        <input
          type="number"
          name="preco_min"
          placeholder="Preço mínimo"
          value={filters.preco_min}
          onChange={handleFilterChange}
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          name="preco_max"
          placeholder="Preço máximo"
          value={filters.preco_max}
          onChange={handleFilterChange}
          className="border p-2 rounded w-32"
        />

        <input
          type="text"
          name="fabricado_em"
          placeholder="Fabricado em"
          value={filters.fabricado_em}
          onChange={handleFilterChange}
          className="border p-2 rounded w-48"
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="estoque_min"
            checked={filters.estoque_min}
            onChange={handleFilterChange}
          />
          Menor que 5 em estoque
        </label>
      </div>

      <button
        onClick={() => openModal()}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
      >
        + Adicionar Produto
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Fabricante</th>
              <th className="border p-2">Descrição</th>
              <th className="border p-2">Preço</th>
              <th className="border p-2">Estoque</th>
              <th className="border p-2">Garantia (meses)</th>
              <th className="border p-2">Fabricado em</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id_produto} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{p.id_produto}</td>
                  <td className="border p-2">{p.nome}</td>
                  <td className="border p-2">{p.tipo}</td>
                  <td className="border p-2">{p.fabricante}</td>
                  <td className="border p-2">{p.descricao}</td>
                  <td className="border p-2">R$ {p.preco}</td>
                  <td className="border p-2">{p.quantidade_estoque}</td>
                  <td className="border p-2">{p.garantia_meses}</td>
                  <td className="border p-2">{p.fabricado_em}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => openModal(p)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id_produto)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-4 text-gray-500 text-center">
                  Nenhum produto encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Editar Produto" : "Adicionar Produto"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="jogo">Jogo</option>
                  <option value="console">Console</option>
                  <option value="acessorio">Acessório</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fabricante</label>
                <input
                  type="text"
                  name="fabricante"
                  placeholder="Fabricante"
                  value={formData.fabricante}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preço</label>
                <input
                  type="number"
                  name="preco"
                  placeholder="Preço"
                  value={formData.preco}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  placeholder="Descrição"
                  value={formData.descricao}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estoque</label>
                <input
                  type="number"
                  name="quantidade_estoque"
                  placeholder="Estoque"
                  value={formData.quantidade_estoque}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Garantia (meses)</label>
                <input
                  type="number"
                  name="garantia_meses"
                  placeholder="Garantia (meses)"
                  value={formData.garantia_meses}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Fabricado em</label>
                <input
                  type="text"
                  name="fabricado_em"
                  placeholder="Fabricado em"
                  value={formData.fabricado_em}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
