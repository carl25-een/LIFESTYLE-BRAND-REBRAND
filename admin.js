const API_URL = 'http://localhost:5000/api/products';
const ADMIN_PASSWORD = 'lifestyle2024'; // Simple password for now

// 1. LOGIN LOGIC
function checkPassword() {
  const input = document.getElementById('admin-password').value;
  if (input === ADMIN_PASSWORD) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadProducts();
  } else {
    document.getElementById('login-error').textContent = 'Incorrect password!';
  }
}

function logout() {
  location.reload();
}

// 2. LOAD PRODUCTS
async function loadProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();
  const tbody = document.getElementById('products-list');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img src="${p.image}" alt="${p.name}"></td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>TSH ${p.price.toLocaleString()}</td>
      <td><button class="btn-delete" onclick="deleteProduct(${p.id})">Delete</button></td>
    </tr>
  `).join('');
}

// 3. ADD PRODUCT
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const newProduct = {
    name: document.getElementById('p-name').value,
    category: document.getElementById('p-category').value,
    price: Number(document.getElementById('p-price').value),
    image: document.getElementById('p-image').value,
    tag: document.getElementById('p-tag').value,
    isNew: document.getElementById('p-isNew').checked
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  });

  document.getElementById('add-product-form').reset();
  loadProducts(); // Refresh table
});

// 4. DELETE PRODUCT
async function deleteProduct(id) {
  if(confirm('Are you sure you want to delete this product?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadProducts();
  }
}