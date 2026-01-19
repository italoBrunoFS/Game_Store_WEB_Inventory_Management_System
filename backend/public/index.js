
async function renderProducts(produtos){
  const products = produtos || await getProducts();
  let productsHTML = '';
  products.forEach(product => {
    productsHTML += `
      <tr>
          <td>${product.id_produto}</td>
          <td>${product.nome}</td>
          <td>${product.tipo}</td>
          <td>${product.fabricante}</td>
          <td>R$${product.preco}</td>
          <td>${product.descricao}</td>
          <td>${product.estoque}</td>
          <td>${product.garantia_meses}</td>
          <td>${product.codigo_barras}</td>
          <td><a href="./update.html?id=${product.id_produto}" class="btn btn-success">Atualizar</a></td>
          <td><button class="btn btn-danger delete-button-js" data-product-id="${product.id_produto}">Deletar</button></td>
      </tr>
    `;
  });
  document.querySelector('.products-table-js').innerHTML = productsHTML;

  document.querySelectorAll('.delete-button-js').forEach(button => {
  button.addEventListener('click', async (e) => {
    const id_produto = e.target.dataset.productId;

    try{
      await axios.delete(`http://localhost:5000/products/${id_produto}`);
      renderProducts();
      const msgDiv = document.querySelector('.success-handler-js');
      msgDiv.innerHTML = `<div class="alert alert-success">✅ Produto Deletado com Sucesso!</div>`;

      setTimeout(() => msgDiv.innerHTML = '', 3000);
    }catch(error){
      console.error("Erro ao remover produto:", error);
      alert("❌ Falha ao remover produto. Verifique os campos e tente novamente.");
    }
  });
});
}

document.getElementById('formProduto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  if(!data.nome || !data.tipo || !data.fabricante){
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  try{
    await axios.post(`http://localhost:5000/products`, data);

    await renderProducts();

    const msgDiv = document.querySelector('.success-handler-js');
    msgDiv.innerHTML = `<div class="alert alert-success">✅ Produto Cadastrado com Sucesso!</div>`;

    setTimeout(() => msgDiv.innerHTML = '', 3000);

    e.target.reset();

    const modalEl = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

  }catch (error) {
    console.error("Erro ao adicionar produto:", error);
    alert("❌ Falha ao adicionar produto. Verifique os campos e tente novamente.");
  }
})

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const successMsg = urlParams.get('success');

  if (successMsg) {
    document.querySelector('.success-handler-js').innerHTML = `<div class="alert alert-success">✅ ${decodeURIComponent(successMsg)}</div>`;
    setTimeout(() => document.querySelector('.success-handler-js').innerHTML = '', 3000);
  }
});


const searchInput = document.querySelector('.search-js');
let isInputVisible = false;

document.querySelector('.search-button-js').addEventListener('click', async () => {
  if (!isInputVisible) {
    searchInput.classList.remove('hidden');
    searchInput.focus();
    isInputVisible = true;
  } else {
    const nome = searchInput.value.trim();
    if (nome) {
      try {
        const res = await axios.get(`http://localhost:5000/products/search?name=${encodeURIComponent(nome)}`);
        renderProducts(res.data);
      } catch (err) {
        console.error('Erro na busca:', err);
        alert('❌ Produto não encontrado ou erro na busca');
      }
    }else{
      renderProducts();
    }
    searchInput.classList.add('hidden');
    isInputVisible = false;
    searchInput.value = '';
  }
});

searchInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const nome = searchInput.value.trim();
    if (nome) {
      try {
        const res = await axios.get(`http://localhost:5000/products/search?name=${encodeURIComponent(nome)}`);
        renderProducts(res.data);
      } catch (err) {
        console.error('Erro na busca:', err);
        alert('❌ Produto não encontrado ou erro na busca');
      }
    }else{
      renderProducts();
    }
    searchInput.classList.add('hidden');
    searchInput.value = '';
    isInputVisible = false;
  }
});

const reportContainer = document.querySelector('.report-container');
let isReportVisible = false;

document.getElementById('btnReport').addEventListener('click', async () => {
  if (!isReportVisible) {
    try {
      const res = await axios.get('http://localhost:5000/products/report');
      const report = res.data;

      let html = `
        <h4>📊 Relatório de Produtos</h4>
        <ul class="list-group">
          <li class="list-group-item">Total de produtos cadastrados: <strong>${report.total_produtos}</strong></li>
          <li class="list-group-item">Valor total do estoque: <strong>R$ ${report.valor_total_estoque}</strong></li>
          <li class="list-group-item">Quantidade total em estoque: <strong>${report.quantidade_total}</strong></li>
        </ul>
        <h5 class="mt-3">Produtos por tipo:</h5>
        <ul class="list-group">
          ${report.produtos_por_tipo.map(t => `<li class="list-group-item">${t.tipo}: ${t.quantidade}</li>`).join('')}
        </ul>
      `;

      reportContainer.innerHTML = html;
      reportContainer.classList.remove('hidden');
      isReportVisible = true;
      reportContainer.scrollIntoView({ behavior: 'smooth' })

    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      alert('❌ Não foi possível gerar o relatório');
    }
  } else {
    reportContainer.classList.add('hidden');
    isReportVisible = false;
  }
});


renderProducts();
