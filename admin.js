// admin.js
import { supabase } from './supabaseClient.js';

// --- NEW: SVG Icons for the Modal Copy Button ---
const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const checkIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

// --- Get General DOM Elements ---
const adminLoginDiv = document.getElementById('admin-login');
const adminDashboardDiv = document.getElementById('admin-dashboard');
const adminPasswordInput = document.getElementById('admin-password');
const loginButton = document.getElementById('login-button');
const loginMessage = document.getElementById('login-message');
const addCodeButton = document.getElementById('add-code-button');
const addCodeModal = document.getElementById('add-code-modal');
const closeModalButton = addCodeModal.querySelector('.close-button');
const addCodeForm = document.getElementById('add-code-form');
const saveMessage = document.getElementById('save-message');
const codeManagementList = document.getElementById('code-management-list');

// --- Get View Code Modal DOM Elements ---
const viewCodeModal = document.getElementById('view-code-modal');
const modalCodeTitle = document.getElementById('modal-code-title');
const modalCodeContentPre = document.getElementById('modal-code-content-pre');
const modalCloseButton = document.getElementById('modal-close-button');
const modalCopyButton = document.getElementById('modal-copy-button');

let isAdminAuthenticated = false;

// --- View Code Modal Functions ---
function openCodeModal(title, code) {
    modalCodeTitle.textContent = title;
    const codeElement = modalCodeContentPre.querySelector('code');
    codeElement.textContent = code;
    Prism.highlightElement(codeElement);
    viewCodeModal.classList.remove('hidden');
}

function closeCodeModal() {
    viewCodeModal.classList.add('hidden');
    modalCodeTitle.textContent = '';
    modalCodeContentPre.querySelector('code').textContent = '';
}

// --- Card Button Handlers ---
// This handler is for the copy button ON THE CARD (uses text feedback)
function handleCopyCode(event) {
    const button = event.currentTarget;
    const pre = button.closest('.code-block-wrapper').querySelector('pre');
    const code = pre.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => { button.textContent = 'Copy'; }, 2000);
    }).catch(err => console.error('Failed to copy text: ', err));
}

// --- Main Admin Functions ---
async function verifyAdminPassword(password) {
    const { data, error } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'admin_password').single();
    if (error) { console.error('Error fetching admin password:', error.message); return false; }
    return data && data.setting_value === password;
}

async function handleLogin() {
    const password = adminPasswordInput.value;
    loginMessage.textContent = '';
    if (!password) { loginMessage.textContent = 'Please enter password.'; return; }
    const isAuthenticated = await verifyAdminPassword(password);
    if (isAuthenticated) {
        isAdminAuthenticated = true;
        adminLoginDiv.classList.add('hidden');
        adminDashboardDiv.classList.remove('hidden');
        loadAdminSqlCodes();
    } else {
        loginMessage.textContent = 'Invalid Admin Password.';
    }
}

async function loadAdminSqlCodes() {
    codeManagementList.innerHTML = '<p class="loading-message">Loading codes for admin...</p>';
    if (!isAdminAuthenticated) { codeManagementList.innerHTML = '<p class="error-message">Access Denied. Please log in as Admin.</p>'; return; }

    const { data: sqlCodes, error } = await supabase.from('sql_codes').select('*').order('created_at', { ascending: false });
    if (error) { codeManagementList.innerHTML = '<p class="error-message">Failed to load admin SQL codes.</p>'; return; }
    
    codeManagementList.innerHTML = '';
    if (sqlCodes.length === 0) { codeManagementList.innerHTML = '<p class="no-codes-message">No SQL codes available yet.</p>'; return; }

    sqlCodes.forEach(code => {
        const codeCard = document.createElement('div');
        codeCard.classList.add('code-card', 'admin-card');
        codeCard.innerHTML = `
            <div class="card-header"><h3>${code.title}</h3></div>
            <p>${code.description || 'No description provided.'}</p>
            <div class="code-block-wrapper">
                <button class="copy-button">Copy</button>
                <pre><code class="language-sql">${code.code}</code></pre>
            </div>
            <button class="view-full-code-button">View Full Code</button>
            <small>Added on: ${new Date(code.created_at).toLocaleString()}</small>
            <div class="admin-actions"><button class="btn btn-danger delete-button" data-id="${code.id}">Delete</button></div>
        `;
        codeManagementList.appendChild(codeCard);
    });

    // Add event listeners for all buttons
    document.querySelectorAll('.copy-button').forEach(button => button.addEventListener('click', handleCopyCode));
    document.querySelectorAll('.delete-button').forEach(button => button.addEventListener('click', handleDeleteCode));
    
    document.querySelectorAll('.view-full-code-button').forEach(button => {
        const card = button.closest('.code-card');
        const pre = card.querySelector('pre');
        if (pre.scrollHeight > 200) {
            button.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const code = card.querySelector('code').textContent;
                openCodeModal(title, code);
            });
        } else {
            button.style.display = 'none';
        }
    });

    Prism.highlightAll();
}

async function handleAddCode(event) {
    event.preventDefault();
    saveMessage.textContent = '';
    if (!isAdminAuthenticated) { saveMessage.style.color = 'red'; saveMessage.textContent = 'Authentication required to add code.'; return; }
    const title = document.getElementById('code-title').value;
    const description = document.getElementById('code-description').value;
    const code = document.getElementById('sql-code-area').value;
    if (!title || !code) { saveMessage.style.color = 'red'; saveMessage.textContent = 'Title and SQL Code are required.'; return; }
    const { error } = await supabase.from('sql_codes').insert([{ title, description, code }]);
    if (error) {
        saveMessage.style.color = 'red';
        saveMessage.textContent = 'Error saving code: ' + error.message;
    } else {
        saveMessage.style.color = 'green';
        saveMessage.textContent = 'Code saved successfully!';
        addCodeForm.reset();
        loadAdminSqlCodes();
        setTimeout(() => {
            addCodeModal.classList.add('hidden');
            saveMessage.textContent = '';
        }, 1500);
    }
}

async function handleDeleteCode(event) {
    if (!isAdminAuthenticated) { alert('Authentication required to delete code.'); return; }
    const codeId = event.target.dataset.id;
    if (confirm('Are you sure you want to delete this SQL code?')) {
        const { error } = await supabase.from('sql_codes').delete().eq('id', codeId);
        if (error) { alert('Failed to delete code: ' + error.message); } 
        else { alert('Code deleted successfully!'); loadAdminSqlCodes(); }
    }
}

// --- Global Event Listeners ---
loginButton.addEventListener('click', handleLogin);
adminPasswordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleLogin(); });
addCodeButton.addEventListener('click', () => {
    if (isAdminAuthenticated) { addCodeModal.classList.remove('hidden'); saveMessage.textContent = ''; } 
    else { alert('Please log in as Admin first.'); }
});
closeModalButton.addEventListener('click', () => addCodeModal.classList.add('hidden'));
window.addEventListener('click', (event) => { if (event.target === addCodeModal) addCodeModal.classList.add('hidden'); });
addCodeForm.addEventListener('submit', handleAddCode);

document.addEventListener('DOMContentLoaded', () => {
    // Set initial icon for the modal copy button
    modalCopyButton.innerHTML = copyIconSVG;
    adminDashboardDiv.classList.add('hidden');
});

// --- View Code Modal Event Listeners ---
modalCloseButton.addEventListener('click', closeCodeModal);
viewCodeModal.addEventListener('click', (event) => { if (event.target === viewCodeModal) closeCodeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !viewCodeModal.classList.contains('hidden')) closeCodeModal(); });

// MODIFIED: Modal copy button listener to use icons
modalCopyButton.addEventListener('click', () => {
    const codeToCopy = modalCodeContentPre.querySelector('code').innerText;
    navigator.clipboard.writeText(codeToCopy).then(() => {
        modalCopyButton.innerHTML = checkIconSVG;
        modalCopyButton.classList.add('copied');
        
        setTimeout(() => {
            modalCopyButton.innerHTML = copyIconSVG;
            modalCopyButton.classList.remove('copied');
        }, 2000);
    });
});