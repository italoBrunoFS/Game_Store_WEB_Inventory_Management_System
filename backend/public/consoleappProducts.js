const axios = require("axios");
const prompt = require("prompt-sync")({ sigint: true });

const API_URL = "http://localhost:5000/products";

async function listarProdutos() {
  const res = await axios.get(API_URL);
  console.log("\n=== Lista de Produtos ===");
  res.data.forEach(prod => {
    console.log(`ID: ${prod.id_produto}`);
    console.log(`Nome: ${prod.nome}`);
    console.log(`Tipo: ${prod.tipo}`);
    console.log(`Fabricante/Produtora: ${prod.fabricante}`);
    console.log(`Preço: R$${prod.preco}`);
    console.log(`Descrição: ${prod.descricao}`);
    console.log(`Estoque: ${prod.estoque}`);
    console.log(`Garantia (meses): ${prod.garantia_meses}`);
    console.log(`Código de barras: ${prod.codigo_barras}`);
    console.log('----------------------------');
  });
}

async function criarProduto() {
  const nome = prompt("Nome: ");
  const tipo = prompt("Tipo (jogo, console, acessorio): ");
  const fabricante = prompt("Fabricante/Produtora: ");
  const preco = parseFloat(prompt("Preço: "));
  const descricao = prompt("Descrição: ");
  const estoque = parseInt(prompt("Estoque: "));
  const garantia_meses = parseInt(prompt("Garantia (meses): "));
  const codigo_barras = prompt("Código de barras: ");

  const res = await axios.post(API_URL, { nome, tipo, fabricante, preco, descricao, estoque, garantia_meses, codigo_barras });
  console.log("Produto criado:", res.data);
}

async function deletarProduto() {
  const id = prompt("ID do produto para deletar: ");
  await axios.delete(`${API_URL}/${id}`);
  console.log("Produto deletado com sucesso!");
}

async function atualizarProduto() {
  const id = prompt("ID do produto para atualizar: ");
  const nome = prompt("Nome: ");
  const tipo = prompt("Tipo: ");
  const fabricante = prompt("Fabricante/Produtora: ");
  const preco = parseFloat(prompt("Preço: "));
  const descricao = prompt("Descrição: ");
  const estoque = parseInt(prompt("Estoque: "));
  const garantia_meses = parseInt(prompt("Garantia (meses): "));
  const codigo_barras = prompt("Código de barras: ");

  await axios.put(`${API_URL}/${id}`, { nome, tipo, fabricante, preco, descricao, estoque, garantia_meses, codigo_barras });
  console.log("Produto atualizado com sucesso!");
}

async function patchProduto() {
  const id = prompt("ID do produto para atualização parcial: ");
  const fields = {};

  const nome = prompt("Nome (enter para pular): ");
  if (nome) fields.nome = nome;

  const tipo = prompt("Tipo (enter para pular): ");
  if (tipo) fields.tipo = tipo;

  const fabricante = prompt("Fabricante/Produtora (enter para pular): ");
  if (fabricante) fields.fabricante = fabricante;

  const precoInput = prompt("Preço (enter para pular): ");
  if (precoInput) fields.preco = parseFloat(precoInput);

  const descricao = prompt("Descrição (enter para pular): ");
  if (descricao) fields.descricao = descricao;

  const estoqueInput = prompt("Estoque (enter para pular): ");
  if (estoqueInput) fields.estoque = parseInt(estoqueInput);

  const garantiaInput = prompt("Garantia (meses) (enter para pular): ");
  if (garantiaInput) fields.garantia_meses = parseInt(garantiaInput);

  const codigo_barras = prompt("Código de barras (enter para pular): ");
  if (codigo_barras) fields.codigo_barras = codigo_barras;

  await axios.patch(`${API_URL}/${id}`, fields);
  console.log("Produto parcialmente atualizado com sucesso!");
}

async function buscarProdutoPorNome() {
  const name = prompt("Nome do produto para buscar: ").trim();
  const res = await axios.get(`${API_URL}/search?name=${encodeURIComponent(name)}`);
  console.log("\n=== Resultados da Busca ===");
  res.data.forEach(prod => {
    console.log(`${prod.id_produto} - ${prod.nome} (${prod.tipo}) - R$${prod.preco}`);
  });
}

async function gerarRelatorio(){
  const res = await axios.get(`${API_URL}/report`);
  const rel = res.data;

  console.log("===== Relatório de Produtos =====");
  console.log(`Total de Produtos: ${rel.total_produtos}`);
  console.log(`Valor Total em Estoque: R$${Number(rel.valor_total_estoque).toFixed(2)}`);
  console.log(`Preço Médio: R$${Number(rel.preco_medio).toFixed(2)}`);
  console.log(`Quantidade Total em Estoque: ${rel.quantidade_total}`);
  console.log("Produtos por Tipo:");
  rel.produtos_por_tipo.forEach(p => {
    console.log(`  - ${p.tipo}: ${p.quantidade}`);
  });
  console.log("=================================");
}

async function main() {
  while (true) {
    console.log(`
=== Menu ===
1. Listar produtos
2. Criar produto
3. Deletar produto
4. Modificar produto (PUT)
5. Atualizar produto (PATCH)
6. Buscar produto por nome
7. Gerar relatório
0. Sair
`);
    const opcao = prompt("Escolha uma opção: ");

    try {
      if (opcao === "1") await listarProdutos();
      else if (opcao === "2") await criarProduto();
      else if (opcao === "3") await deletarProduto();
      else if (opcao === "4") await atualizarProduto();
      else if (opcao === "5") await patchProduto();
      else if (opcao === "6") await buscarProdutoPorNome();
      else if (opcao === "7") await gerarRelatorio();
      else if (opcao === "0") break;
      else console.log("Opção inválida!");
    } catch (err) {
      console.log("Erro:", err.response?.data?.error || err.response?.data?.message || err.message);
    }
  }
}

main();
