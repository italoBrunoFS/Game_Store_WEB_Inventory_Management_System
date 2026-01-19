const API_URL = 'http://localhost:5000/products'

async function fillForm(){
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return;

  try {
    const res = await axios.get(`${API_URL}/${id}`);
    const product = res.data[0];
    console.log(product);

    const form = document.querySelector('form');

    for (const key in product) {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = product[key];
      }
    }
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
  }
}

document.getElementById('formAtualizar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  try{
    await axios.patch(`${API_URL}/${id}`, data);
    const message = encodeURIComponent('Produto atualizado com sucesso!');
    window.location.href = `./index.html?success=${message}`;
  }catch(error){
    console.error("Erro ao atualizar produto:", error);
    alert("❌ Falha ao atualizar produto. Verifique os campos e tente novamente.");
  }
})

fillForm();