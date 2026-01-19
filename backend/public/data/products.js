const API_URL = 'http://localhost:5000/products'

async function getProducts(){
  const res = await axios.get(`${API_URL}`);
  return res.data;
}