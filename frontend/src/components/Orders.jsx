import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const funcionarioId = user?.id;

  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ text: "", type: "" });

  // Filtros
  const [filterCliente, setFilterCliente] = useState("");
  const [filterFuncionario, setFilterFuncionario] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientesRes, produtosRes, funcionariosRes, ordersRes] =
          await Promise.all([
            axios.get("http://localhost:5000/clients", {
              headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
            }),
            axios.get("http://localhost:5000/products", {
              headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
            }),
            axios.get("http://localhost:5000/employees", {
              headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
            }),
            axios.get("http://localhost:5000/orders", {
              headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
            })
          ]);

        setClientes(clientesRes.data);
        setProdutos(produtosRes.data);
        setFuncionarios(funcionariosRes.data);
        setOrders(ordersRes.data);
        setFilteredOrders(ordersRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        showToast("Erro ao carregar dados.", "error");
      }
    }
    fetchData();
  }, []);

  const showToast = (text, type) => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3000);
  };

  // Filtragem
  const applyFilters = () => {
    let filtered = [...orders];
    if (filterCliente) filtered = filtered.filter((o) => o.cliente_nome === filterCliente);
    if (filterFuncionario) filtered = filtered.filter((o) => o.funcionario_nome === filterFuncionario);
    if (filterStatus) filtered = filtered.filter((o) => o.status_pagamento === filterStatus);
    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setFilterCliente("");
    setFilterFuncionario("");
    setFilterStatus("");
    setFilteredOrders(orders);
  };

  const handleAddItem = () => setItens([...itens, { produto_id: "", quantidade: 1 }]);
  const handleItemChange = (index, field, value) => {
    const updated = [...itens];
    updated[index][field] = value;
    setItens(updated);
  };
  const handleRemoveItem = (index) => {
    const updated = [...itens];
    updated.splice(index, 1);
    setItens(updated);
  };

  // Criar ordem
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedCliente || itens.length === 0) {
      showToast("Selecione cliente e ao menos um item.", "error");
      return;
    }

    for (const item of itens) {
      const produto = produtos.find((p) => p.id_produto === parseInt(item.produto_id));
      if (!produto) {
        showToast("Produto inválido.", "error");
        return;
      }
      if (produto.quantidade_estoque < item.quantidade) {
        showToast(`Produto "${produto.nome}" sem estoque suficiente.`, "error");
        return;
      }
    }

    try {
      await axios.post(
        "http://localhost:5000/orders",
        {
          cliente: { id_cliente: selectedCliente },
          funcionario_id: funcionarioId,
          forma_pagamento: formaPagamento,
          itens
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } }
      );
      showToast("Ordem criada com sucesso!", "success");
      setItens([]);
      setSelectedCliente("");
      setFormaPagamento("Pix");
      refreshOrders();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Erro ao criar ordem.", "error");
    }
  };

  // Atualizar status
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } }
      );
      showToast("Status atualizado!", "success");
      refreshOrders();
    } catch (err) {
      console.error(err);
      showToast("Erro ao atualizar status.", "error");
    }
  };

  // Deletar ordem
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Deseja realmente deletar essa ordem?")) return;
    try {
      await axios.delete(`http://localhost:5000/orders/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
      });
      showToast("Ordem deletada!", "success");
      refreshOrders();
    } catch (err) {
      console.error(err);
      showToast("Erro ao deletar ordem.", "error");
    }
  };

  // Recarregar ordens
  const refreshOrders = async () => {
    try {
      const ordersRes = await axios.get("http://localhost:5000/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
      });
      setOrders(ordersRes.data);
      setFilteredOrders(ordersRes.data);

      const produtosRes = await axios.get("http://localhost:5000/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
      });
      setProdutos(produtosRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {toast.text && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {toast.text}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-700">Gerenciar Ordens</h1>

      <div className="bg-white p-6 rounded shadow-md max-w-6xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="border p-2 rounded"
            value={filterCliente}
            onChange={(e) => setFilterCliente(e.target.value)}
          >
            <option value="">Todos os clientes</option>
            {clientes.map((c) => (
              <option key={c.id_cliente} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={filterFuncionario}
            onChange={(e) => setFilterFuncionario(e.target.value)}
          >
            <option value="">Todos os funcionários</option>
            {funcionarios.map((f) => (
              <option key={f.id_funcionario} value={f.nome}>
                {f.nome}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="Aguardando">Aguardando</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
              Aplicar
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 cursor-pointer"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      <form
        className="bg-white p-6 rounded shadow-md max-w-3xl mb-8"
        onSubmit={handleCreateOrder}
      >
        <h2 className="text-xl font-semibold mb-4">Nova Ordem</h2>
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">Cliente</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(e.target.value)}
            required
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((c) => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nome} - {c.cidade}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Forma de Pagamento
          </label>
          <select
            className="border p-2 rounded w-full"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          >
            <option value="Pix">Pix</option>
            <option value="Cartão">Cartão</option>
            <option value="Boleto">Boleto</option>
            <option value="Berries">Berries</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Itens da Compra</h3>
          {itens.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <select
                className="border p-2 rounded flex-1"
                value={item.produto_id}
                onChange={(e) => handleItemChange(idx, "produto_id", e.target.value)}
                required
              >
                <option value="">Selecione um produto</option>
                {produtos.map((p) => (
                  <option key={p.id_produto} value={p.id_produto}>
                    {p.nome} - R$ {p.preco} - Estoque: {p.quantidade_estoque}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={item.quantidade}
                onChange={(e) => handleItemChange(idx, "quantidade", e.target.value)}
                className="border p-2 rounded w-20"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 cursor-pointer"
          >
            Adicionar Item
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Criar Ordem
        </button>
      </form>

      <div className="bg-white p-6 rounded shadow-md max-w-6xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Ordens Existentes
        </h2>
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">Nenhuma ordem encontrada.</p>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id_compra}
                className="border rounded-xl shadow-sm p-6 bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-700">
                    Ordem #{order.id_compra} - {formatDate(order.data_compra)}
                  </h3>
                  <button
                    onClick={() => handleDeleteOrder(order.id_compra)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Deletar
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
                  <div>
                    <span className="font-semibold">Cliente:</span>{" "}
                    {order.cliente_nome}
                  </div>
                  <div>
                    <span className="font-semibold">Funcionário:</span>{" "}
                    {order.funcionario_nome}
                  </div>
                  <div>
                    <span className="font-semibold">Forma de Pagamento:</span>{" "}
                    {order.forma_pagamento}
                  </div>
                  <div>
                    <span className="font-semibold">Valor Total:</span>{" "}
                    R$ {order.valor_total.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-semibold">Desconto:</span>{" "}
                    R$ {order.desconto_aplicado.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {order.status_pagamento === "Confirmado" ? (
                      <span className="px-2 py-1 rounded bg-green-200 text-green-800">
                        Confirmado
                      </span>
                    ) : (
                      <select
                        value={order.status_pagamento}
                        onChange={(e) =>
                          handleUpdateStatus(order.id_compra, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="Aguardando">Aguardando</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-2 text-gray-700">
                    Itens da Compra
                  </h4>
                  <ul className="space-y-2">
                    {order.itens?.map((i) => (
                      <li
                        key={i.id_item}
                        className="border rounded-lg p-3 bg-white shadow-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">{i.produto_nome}</span>
                          <span className="text-gray-600">
                            Subtotal: R$ {i.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>Quantidade: {i.quantidade}</span> |{" "}
                          <span>
                            Preço Unitário: R$ {i.preco_unitario.toFixed(2)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
