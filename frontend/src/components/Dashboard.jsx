import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const today = new Date();
  const [mes, setMes] = useState(today.getMonth() + 1);
  const [ano, setAno] = useState(today.getFullYear());
  const [report, setReport] = useState({
    vendasDetalhadas: [],
    vendasPorFuncionario: [],
    produtosPoucoEstoque: [],
    produtosSemEstoque: [],
    produtoMaisVendido: null,
    ordensHoje: 0,
    lucroTotal: 0,
    totalProdutos: 0,
    quantidadeTotalEstoque: 0,
  });

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

  const fetchReport = async (mesParam = mes, anoParam = ano) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/dashboard?mes=${mesParam}&ano=${anoParam}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        }
      );

      const data = response.data;

      setReport({
        vendasDetalhadas: data.vendasDetalhadas || [],
        vendasPorFuncionario: data.vendasPorFuncionario.map(f => ({
          ...f,
          totalVendas: parseFloat(f.total_vendas),
        })),
        produtosPoucoEstoque: data.produtosPoucoEstoque.map(p => ({
          ...p,
          quantidade_estoque: Number(p.quantidade_estoque),
        })),
        produtosSemEstoque: data.produtosSemEstoque,
        produtoMaisVendido:
          data.produtoMaisVendido && data.produtoMaisVendido.length > 0
            ? {
                ...data.produtoMaisVendido[0],
                quantidade_vendida: Number(data.produtoMaisVendido[0].total_vendido),
              }
            : null,
        ordensHoje: Number(data.ordens_hoje),
        lucroTotal: parseFloat(data.lucro_total),
        totalProdutos: Number(data.total_produtos),
        quantidadeTotalEstoque: Number(data.quantidade_total_estoque),
      });
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterChange = () => {
    fetchReport(mes, ano);
  };

  const cardColors = [
    "bg-indigo-500 text-white",
    "bg-green-500 text-white",
    "bg-yellow-400 text-gray-800",
    "bg-pink-500 text-white",
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Dashboard</h1>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div>
          <label className="font-medium mr-2">Mês:</label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border rounded p-1"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium mr-2">Ano:</label>
          <input
            type="number"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
        </div>

        <button
          onClick={handleFilterChange}
          className="bg-indigo-500 text-white rounded px-4 py-2 hover:bg-indigo-600 transition"
        >
          Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Ordens Hoje", value: report.ordensHoje },
          { title: "Lucro Total", value: `R$ ${report.lucroTotal.toFixed(2)}` },
          { title: "Total de Produtos", value: report.totalProdutos },
          { title: "Estoque Total", value: report.quantidadeTotalEstoque },
        ].map((card, index) => (
          <div
            key={index}
            className={`${cardColors[index]} rounded-xl shadow-lg p-6 flex flex-col justify-between transform hover:scale-105 transition-transform`}
          >
            <span className="text-lg font-medium">{card.title}</span>
            <span className="text-3xl font-bold mt-2">{card.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-400">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Produtos com Estoque Baixo (&lt;5)
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {report.produtosPoucoEstoque.length > 0 ? (
              report.produtosPoucoEstoque.map((p) => (
                <li key={p.id_produto}>
                  <span className="font-medium">{p.nome}</span> - {p.quantidade_estoque} em estoque
                </li>
              ))
            ) : (
              <li>Nenhum produto com estoque baixo</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Produtos Sem Estoque</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {report.produtosSemEstoque.length > 0 ? (
              report.produtosSemEstoque.map((p) => <li className="font-medium" key={p.id_produto}>{p.nome}</li>)
            ) : (
              <li>Nenhum produto sem estoque</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Produto Mais Vendido</h2>
        {report.produtoMaisVendido ? (
          <p className="text-gray-700">
            <span className="font-medium">{report.produtoMaisVendido.nome}</span> -{" "}
            {report.produtoMaisVendido.quantidade_vendida} unidades vendidas
          </p>
        ) : (
          <p className="text-gray-500">Nenhum produto vendido ainda</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Vendas Detalhadas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-indigo-100">
              <tr>
                <th className="border p-3 text-gray-700">Funcionário</th>
                <th className="border p-3 text-gray-700">Cliente</th>
                <th className="border p-3 text-gray-700">Compra</th>
                <th className="border p-3 text-gray-700">Data</th>
                <th className="border p-3 text-gray-700">Valor</th>
                <th className="border p-3 text-gray-700">Desconto</th>
                <th className="border p-3 text-gray-700">Pagamento</th>
                <th className="border p-3 text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {report.vendasDetalhadas.length > 0 ? (
                report.vendasDetalhadas.map((f) => (
                  <tr key={f.id_compra} className="hover:bg-indigo-50 text-gray-700 text-center">
                    <td className="border p-2">{f.funcionario_nome}</td>
                    <td className="border p-2">{f.cliente_nome}</td>
                    <td className="border p-2">{f.id_compra}</td>
                    <td className="border p-2">{formatDate(f.data_compra)}</td>
                    <td className="border p-2">R$ {parseFloat(f.valor_total).toFixed(2)}</td>
                    <td className="border p-2">R$ {parseFloat(f.desconto_aplicado || 0).toFixed(2)}</td>
                    <td className="border p-2">{f.forma_pagamento}</td>
                    <td className="border p-2">{f.status_pagamento}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-gray-500 text-center">
                    Nenhuma venda registrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
