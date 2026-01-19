const axios = require("axios");
const prompt = require("prompt-sync")({ sigint: true });

const API_URL = "http://localhost:5000/games";

async function listarJogos() {
  const res = await axios.get(API_URL);
  console.log("\n=== Lista de Jogos ===");
   res.data.forEach(game => {
    console.log(`ID: ${game.id}`);
    console.log(`Título: ${game.title}`);
    console.log(`Gênero: ${game.genre}`);
    console.log(`Preço: R$${game.price}`);
    console.log(`Data de lançamento: ${game.release_date}`);
    console.log(`Descrição: ${game.description}`);
    console.log(`Estoque: ${game.stock_quantity}`);
    console.log('----------------------------');
  });
}

async function criarJogo() {
  const title = prompt("Título: ");
  const genre = prompt("Gênero: ");
  const price = parseFloat(prompt("Preço: "));
  const release_date = prompt("Data de lançamento (YYYY-MM-DD): ");
  const description = prompt("Descrição: ");

  const res = await axios.post(API_URL, { title, genre, price, release_date, description });
  console.log("Jogo criado:", res.data);
}

async function deletarJogo() {
  const id = prompt("ID do jogo para deletar: ");
  await axios.delete(`${API_URL}/${id}`);
  console.log("Jogo deletado com sucesso!");
}

async function atualizarJogo() {
  const id = prompt("ID do jogo para atualizar: ");
  const title = prompt("Título: ");
  const genre = prompt("Gênero: ");
  const price = parseFloat(prompt("Preço: "));
  const release_date = prompt("Data de lançamento (YYYY-MM-DD): ");
  const description = prompt("Descrição: ");

  await axios.put(`${API_URL}/${id}`, { title, genre, price, release_date, description });
  console.log("Jogo atualizado com sucesso!");
}

async function patchJogo() {
  const id = prompt("ID do jogo para atualização parcial: ");
  const fields = {};
  
  const title = prompt("Título (enter para pular): ");
  if (title) fields.title = title;
  
  const genre = prompt("Gênero (enter para pular): ");
  if (genre) fields.genre = genre;
  
  const priceInput = prompt("Preço (enter para pular): ");
  if (priceInput) fields.price = parseFloat(priceInput);
  
  const release_date = prompt("Data de lançamento (YYYY-MM-DD) (enter para pular): ");
  if (release_date) fields.release_date = release_date;
  
  const description = prompt("Descrição (enter para pular): ");
  if (description) fields.description = description;

  await axios.patch(`${API_URL}/${id}`, fields);
  console.log("Jogo parcialmente atualizado com sucesso!");
}

async function buscarJogoPorNome() {
  const name = prompt("Nome do jogo para buscar: ");
  const res = await axios.get(`${API_URL}/search?name=${encodeURIComponent(name)}`);
  console.log("\n=== Resultados da Busca ===");
  res.data.forEach(game => {
    console.log(`${game.id} - ${game.title} (${game.genre}) - R$${game.price}`);
  });
}

async function main() {
  while (true) {
    console.log(`
=== Menu ===
1. Listar jogos
2. Criar jogo
3. Deletar jogo
4. Modificar jogo (PUT)
5. Atualizar jogo (PATCH)
6. Buscar jogo por nome
0. Sair
`);
    const opcao = prompt("Escolha uma opção: ");

    try {
      if (opcao === "1") await listarJogos();
      else if (opcao === "2") await criarJogo();
      else if (opcao === "3") await deletarJogo();
      else if (opcao === "4") await atualizarJogo();
      else if (opcao === "5") await patchJogo();
      else if (opcao === "6") await buscarJogoPorNome();
      else if (opcao === "0") break;
      else console.log("Opção inválida!");
    } catch (err) {
      console.log("Erro:", err.response?.data?.error || err.response?.data?.message || err.message);
    }
  }
}

main();
