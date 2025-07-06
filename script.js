// Select elements
const apiBtn = document.getElementById('apiBtn');
const manualBtn = document.getElementById('manualBtn');
const formContainer = document.getElementById('formContainer');
const blogContainer = document.getElementById('blogContainer');

// Array to hold blogs
let blogs = [];

// Load blogs from localStorage on page load
window.onload = () => {
  const stored = localStorage.getItem('blogs');
  if (stored) {
    blogs = JSON.parse(stored);
    blogs.forEach(b => createCard(b));
  }
};

// Create Blog Using API
apiBtn.onclick = () => {
  formContainer.innerHTML = `
    <form id="apiForm">
      <input type="text" id="apiTitle" placeholder="Enter blog title" required />
      <button type="submit">Search Blog</button>
    </form>
  `;

  const apiForm = document.getElementById('apiForm');
  apiForm.onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('apiTitle').value.trim();
    if (!title) return;

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await res.json();
      const found = data.find(post => post.title.toLowerCase() === title.toLowerCase());

      if (found) {
        const blog = {
          id: Date.now(),
          title: found.title,
          body: found.body
        };
        blogs.push(blog);
        saveBlogs();
        createCard(blog);
        formContainer.innerHTML = '';
      } else {
        alert('Blog not found!');
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('Something went wrong. Try again.');
    }
  };
};

// Create Blog Manually
manualBtn.onclick = () => {
  formContainer.innerHTML = `
    <form id="manualForm">
      <input type="text" id="manualTitle" placeholder="Title" required />
      <textarea id="manualBody" placeholder="Blog description" rows="5" required></textarea>
      <button type="submit">Create Blog</button>
    </form>
  `;

  const manualForm = document.getElementById('manualForm');
  manualForm.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('manualTitle').value.trim();
    const body = document.getElementById('manualBody').value.trim();
    if (!title || !body) return;

    const blog = {
      id: Date.now(),
      title,
      body
    };

    blogs.push(blog);
    saveBlogs();
    createCard(blog);
    formContainer.innerHTML = '';
  };
};

// Create Blog Card
function createCard(blog) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = blog.id;

  card.innerHTML = `
    <h3 contenteditable="false">${blog.title}</h3>
    <p contenteditable="false">${blog.body}</p>
    <button class="editBtn">Edit</button>
    <button class="saveBtn" disabled>Save</button>
    <button class="deleteBtn">Delete</button>
  `;

  const editBtn = card.querySelector('.editBtn');
  const saveBtn = card.querySelector('.saveBtn');
  const deleteBtn = card.querySelector('.deleteBtn');
  const titleEl = card.querySelector('h3');
  const bodyEl = card.querySelector('p');

  editBtn.onclick = () => {
    titleEl.contentEditable = true;
    bodyEl.contentEditable = true;
    saveBtn.disabled = false;
    titleEl.focus();
  };

  saveBtn.onclick = () => {
    const id = parseInt(card.dataset.id);
    const newTitle = titleEl.innerText.trim();
    const newBody = bodyEl.innerText.trim();
    const index = blogs.findIndex(b => b.id === id);

    if (index !== -1) {
      blogs[index].title = newTitle;
      blogs[index].body = newBody;
      saveBlogs();
      titleEl.contentEditable = false;
      bodyEl.contentEditable = false;
      saveBtn.disabled = true;
    }
  };

  deleteBtn.onclick = () => {
    const id = parseInt(card.dataset.id);
    blogs = blogs.filter(b => b.id !== id);
    saveBlogs();
    card.remove();
  };

  blogContainer.appendChild(card);
}

// Save blogs to localStorage
function saveBlogs() {
  localStorage.setItem('blogs', JSON.stringify(blogs));
}
