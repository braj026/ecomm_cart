const API_BASE_URL = 'http://localhost:8080/api';

// --- UTILITY FUNCTIONS ---
const getToken = () => localStorage.getItem('jwt_token');
const getUsername = () => localStorage.getItem('username');
const isLoggedIn = () => !!getToken();

function decodeJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
}

function getUserRoles() {
    const decodedToken = decodeJwt(getToken());
    return decodedToken?.roles || [];
}

function isAdmin() {
    return getUserRoles().includes('ROLE_ADMIN');
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `z-50 fixed top-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg ${isError ? 'bg-red-500' : 'bg-green-500'}`;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

async function apiRequest(endpoint, method = 'GET', body = null, isFormData = false) {
    const headers = {};
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    const config = { method, headers };
    if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
    }
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }
        if (response.status === 204 || method === 'DELETE') return null;
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// --- CUSTOM MODAL FUNCTIONS ---
function showCustomModal({ title, message, buttons, isWarning = false }) {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalButtons = document.getElementById('modal-buttons');
    const infoIcon = document.getElementById('modal-icon-info');
    const warningIcon = document.getElementById('modal-icon-warning');
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    infoIcon.classList.toggle('hidden', isWarning);
    warningIcon.classList.toggle('hidden', !isWarning);
    modalButtons.innerHTML = '';
    buttons.forEach(buttonInfo => {
        const button = document.createElement('button');
        button.textContent = buttonInfo.text;
        button.className = buttonInfo.class;
        button.onclick = () => {
            modal.classList.add('hidden');
            buttonInfo.onClick();
        };
        modalButtons.appendChild(button);
    });
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function showCustomConfirm(message) {
    return new Promise((resolve) => {
        showCustomModal({
            title: 'Confirmation',
            message: message,
            isWarning: true,
            buttons: [
                {
                    text: 'Yes',
                    class: 'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm',
                    onClick: () => resolve(true),
                },
                {
                    text: 'No',
                    class: 'mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm',
                    onClick: () => resolve(false),
                },
            ]
        });
    });
}

function showCustomAlert(message) {
     return new Promise((resolve) => {
        showCustomModal({
            title: 'Information',
            message: message,
            isWarning: false,
            buttons: [
                {
                    text: 'OK',
                    class: 'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm',
                    onClick: () => resolve(true),
                }
            ]
        });
    });
}

// --- AUTHENTICATION ---
function handleLogin(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    apiRequest('/auth/login', 'POST', { username, password })
        .then(data => {
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('username', data.username);
            window.location.href = '/';
        })
        .catch(error => {
            const errorMessageEl = document.getElementById('error-message');
            if (errorMessageEl) errorMessageEl.textContent = 'Invalid credentials. Please try again.';
            console.error('Login failed', error);
        });
}

function handleRegister(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    apiRequest('/auth/register', 'POST', { name, username, password })
        .then(data => {
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('username', data.username);
            window.location.href = '/';
        })
        .catch(error => {
            const errorMessageEl = document.getElementById('error-message');
            if (errorMessageEl) errorMessageEl.textContent = 'Registration failed. Username might be taken.';
            console.error('Registration failed', error);
        });
}

function handleLogout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
}

function updateNav() {
    const loggedIn = isLoggedIn();
    const username = getUsername();
    const admin = isAdmin();

    document.querySelectorAll('#admin-nav').forEach(el => el.classList.toggle('hidden', !admin));
    document.querySelectorAll('#cart-nav').forEach(el => el.classList.toggle('hidden', !loggedIn));
    document.querySelectorAll('#orders-nav').forEach(el => el.classList.toggle('hidden', !loggedIn));
    document.querySelectorAll('#login-nav').forEach(el => el.classList.toggle('hidden', loggedIn));
    document.querySelectorAll('#register-nav').forEach(el => el.classList.toggle('hidden', loggedIn));
    document.querySelectorAll('#user-info').forEach(div => {
        div.classList.toggle('hidden', !loggedIn);
        div.classList.toggle('flex', loggedIn);
        if (loggedIn) {
            div.querySelector('#username-display').textContent = `Hi, ${username}`;
            div.querySelector('#logout-btn').addEventListener('click', handleLogout);
        }
    });
}

// --- PAGE-SPECIFIC LOGIC ---
function loadProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    apiRequest('/products')
        .then(products => {
            if (!products || products.length === 0) {
                productList.innerHTML = `<p class="text-gray-500 col-span-full text-center">No products have been added yet.</p>`;
                return;
            }
            productList.innerHTML = products.map(product => {
                const price = product.price ? Number(product.price).toFixed(2) : '0.00';
                // FIXED: Added flexbox classes to align content
                return `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
                    <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-lg font-semibold">${product.name}</h3>
                        <p class="text-gray-600 mt-1 flex-grow">${product.description}</p>
                        <div class="flex justify-between items-center mt-4">
                            <span class="text-xl font-bold text-gray-900">$${price}</span>
                            <button onclick="addToCart(${product.id})" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400" ${!isLoggedIn() ? 'disabled title="Please log in to add items"' : ''}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>`;
            }).join('');
        });
}

async function addToCart(productId) {
    if (!isLoggedIn()) {
        window.location.href = '/login.html';
        return;
    }
    try {
        await apiRequest('/cart', 'POST', { productId, quantity: 1 });
        showToast('Item successfully added to cart!');
    } catch (error) {
        showToast('Failed to add item. Please try again.', true);
        console.error('Add to cart failed', error);
    }
}

// --- CART AND ORDER FUNCTIONS ---
async function loadCart() {
    const cartContainer = document.getElementById('cart-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    if (!cartItemsContainer) return;

    try {
        const items = await apiRequest('/cart');
        if (!items || items.length === 0) {
            cartContainer.classList.add('hidden');
            emptyCartMessage.classList.remove('hidden');
        } else {
            cartContainer.classList.remove('hidden');
            emptyCartMessage.classList.add('hidden');
            cartItemsContainer.innerHTML = items.map(item => {
                const price = (Number(item.price) * item.quantity).toFixed(2);
                return `
                <div class="flex items-center justify-between border-b py-4">
                    <div class="flex items-center space-x-4">
                        <img src="${item.imageUrl}" alt="${item.productName}" class="w-20 h-20 object-cover rounded">
                        <div>
                            <h4 class="font-semibold">${item.productName}</h4>
                            <p class="text-gray-600">Quantity: ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">$${price}</p>
                        <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 text-sm mt-1">Remove</button>
                    </div>
                </div>`;
            }).join('');

            const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
            cartSummaryContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-gray-700">Total:</span>
                    <span class="text-xl font-bold text-gray-900">$${total.toFixed(2)}</span>
                </div>
                <button onclick="placeOrder()" class="w-full mt-4 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold">
                    Place Order
                </button>`;
        }
    } catch (error) {
        console.error("Failed to load cart:", error);
    }
}

async function removeFromCart(cartItemId) {
    const confirmed = await showCustomConfirm('Are you sure you want to remove this item?');
    if (confirmed) {
        try {
            await apiRequest(`/cart/${cartItemId}`, 'DELETE');
            loadCart();
        } catch (error) {
            showToast('Failed to remove item.', true);
        }
    }
}

async function placeOrder() {
    const confirmed = await showCustomConfirm('Are you sure you want to place this order?');
    if (confirmed) {
        try {
            await apiRequest('/orders', 'POST');
            showToast('Order placed successfully!');
            window.location.href = '/orders.html';
        } catch (error) {
            showToast('Failed to place order.', true);
        }
    }
}

async function loadOrders() {
    const ordersContainer = document.getElementById('orders-container');
    const noOrdersMessage = document.getElementById('no-orders-message');
    if (!ordersContainer) return;
    try {
        const orders = await apiRequest('/orders');
        if (!orders || orders.length === 0) {
            noOrdersMessage.classList.remove('hidden');
        } else {
            noOrdersMessage.classList.add('hidden');
            ordersContainer.innerHTML = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).map(order => {
                 const total = Number(order.totalAmount).toFixed(2);
                 return `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-lg font-bold">Order #${order.id}</h3>
                    <p>Total: $${total}</p>
                </div>`;
            }).join('');
        }
    } catch (error) {
        console.error("Failed to load orders:", error);
    }
}

// --- ADMIN FUNCTIONS ---
function loadAdminProducts() {
    const productList = document.getElementById('admin-product-list');
    if (!productList) return;
    apiRequest('/products')
        .then(products => {
            if (!products || products.length === 0) {
                productList.innerHTML = `<p class="text-gray-500 col-span-full text-center">No products found.</p>`;
                return;
            }
            productList.innerHTML = products.map(product => {
                const price = product.price ? Number(product.price).toFixed(2) : '0.00';
                return `
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-40 object-cover">
                    <div class="p-4">
                        <h3 class="text-md font-semibold">${product.name}</h3>
                        <p class="text-lg font-bold text-gray-900">$${price}</p>
                        <div class="flex justify-end space-x-2 mt-2">
                            <button onclick="deleteProduct(${product.id})" class="text-sm text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                </div>`;
            }).join('');
        });
}

function handleAddProduct(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    apiRequest('/admin/products', 'POST', formData, true)
        .then(() => {
            showToast("Product added successfully!");
            form.reset();
            loadAdminProducts();
        })
        .catch(error => {
            showToast(`Error: ${error.message}`, true);
        });
}

async function deleteProduct(productId) {
    const confirmed = await showCustomConfirm('Are you sure you want to delete this product?');
    if (confirmed) {
        apiRequest(`/admin/products/${productId}`, 'DELETE')
            .then(() => {
                showToast("Product deleted successfully!");
                loadAdminProducts();
            })
            .catch(error => {
                showToast(`Error: ${error.message}`, true);
            });
    }
}

// --- ROUTER/INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    const path = window.location.pathname;
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    if (path === '/' || path.endsWith('index.html')) {
        loadProducts();
    } else if (path.endsWith('/cart.html')) {
        if (!isLoggedIn()) window.location.href = '/login.html';
        else loadCart();
    } else if (path.endsWith('/orders.html')) {
        if (!isLoggedIn()) window.location.href = '/login.html';
        else loadOrders();
    } else if (path.endsWith('/admin.html')) {
        if (!isAdmin()) {
            showCustomAlert("Access Denied. You must be an admin to view this page.")
                .then(() => {
                    window.location.href = '/';
                });
            return;
        }
        document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);
        loadAdminProducts();
    }
});