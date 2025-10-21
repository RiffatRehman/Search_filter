// ===== SIGNUP =====
const signupBtn = document.getElementById('signup-btn');
if(signupBtn){
  signupBtn.addEventListener('click',()=>{
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const gender = document.getElementById('gender').value;
    if(!name || !email || !gender){
      alert("Fill all fields!");
      return;
    }

    localStorage.setItem('user', JSON.stringify({name,email,gender}));

    // Signup animation
    const container = document.querySelector('.auth-container');
    container.style.transition = "all 0.5s ease";
    container.style.transform = "scale(0)";
    container.style.opacity = "0";

    setTimeout(()=>{
      window.location.href="dashboard.html";
    }, 500);
  });
}

// ===== DASHBOARD =====
const user = JSON.parse(localStorage.getItem('user'));
if(!user){
  window.location.href="index.html";
}

// Page elements (dashboard only)
const logoutBtn = document.getElementById('logout-btn');
const productContainer = document.getElementById('product-container');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const itemImg = document.getElementById('item-img');
const itemTitle = document.getElementById('item-title');
const itemCategory = document.getElementById('item-category');
const itemDescription = document.getElementById('item-description');

let products = [];

// Dashboard functions (only if elements exist)
if(productContainer){

  // Fetch products on page load
  fetchProducts();

  // Logout
  if(logoutBtn){
    logoutBtn.addEventListener('click',()=>{
      localStorage.removeItem('user');
      window.location.href="index.html";
    });
  }

  // Close modal
  if(closeModal){
    closeModal.addEventListener('click',()=>{
      modal.classList.add('hidden');
    });
  }

  // Fetch products from FakeStore API
  async function fetchProducts(){
    try{
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      products = data.map(p=>({
        name: p.title,
        category: p.category,
        price: p.price,
        img: p.image,
        description: p.description
      }));
      displayProducts(products);
      populateCategories();
    }catch(err){
      console.error("Error fetching products:", err);
      productContainer.innerHTML="<p>Failed to load products.</p>";
    }
  }

  // Display product cards
  function displayProducts(list){
    productContainer.innerHTML="";
    if(list.length === 0){
      productContainer.innerHTML="<p>No products found.</p>";
      return;
    }
    list.forEach(p=>{
      const card = document.createElement('div');
      card.className="product-card";
      card.innerHTML=`
        <img src="${p.img}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${p.category}</p>
          <p>$${p.price}</p>
        </div>`;
      card.addEventListener('click', ()=>{
        itemImg.src=p.img;
        itemTitle.textContent=p.name;
        itemCategory.textContent=`Category: ${p.category}`;
        itemDescription.textContent=p.description;
        modal.classList.remove('hidden');
      });
      productContainer.appendChild(card);
    });
  }

  // Populate categories in filter
  function populateCategories(){
    const cats = ["all", ...new Set(products.map(p=>p.category))];
    categoryFilter.innerHTML="";
    cats.forEach(c=>{
      const opt = document.createElement('option');
      opt.value=c;
      opt.textContent=c;
      categoryFilter.appendChild(opt);
    });
  }

  // Search products
  searchInput.addEventListener('input',()=>{
    const term = searchInput.value.toLowerCase();
    const filtered = products.filter(p=>p.name.toLowerCase().includes(term));
    displayProducts(filtered);
  });

  // Filter by category
  categoryFilter.addEventListener('change',()=>{
    const cat = categoryFilter.value;
    const filtered = cat==="all"?products:products.filter(p=>p.category===cat);
    displayProducts(filtered);
  });

  // Sort products
  sortSelect.addEventListener('change',()=>{
    const type = sortSelect.value;
    let sorted = [...products];

    if(type==="name-asc") sorted.sort((a,b)=>a.name.localeCompare(b.name));
    if(type==="name-desc") sorted.sort((a,b)=>b.name.localeCompare(a.name));
    if(type==="category-asc") sorted.sort((a,b)=>a.category.localeCompare(b.category));
    if(type==="category-desc") sorted.sort((a,b)=>b.category.localeCompare(a.category));

    displayProducts(sorted);
  });
}

// Page fade-in animation
window.addEventListener('load', () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  setTimeout(()=>{ document.body.style.opacity = "1"; }, 50);
});
