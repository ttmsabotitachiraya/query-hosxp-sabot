// app.js
import { supabase } from './supabaseClient.js';

// --- NEW: SVG Icons for the Modal Copy Button ---
const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const checkIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

// --- Get Modal DOM Elements ---
const viewCodeModal = document.getElementById('view-code-modal');
const modalCodeTitle = document.getElementById('modal-code-title');
const modalCodeDescription = document.getElementById('modal-code-description');
const modalCodeContentPre = document.getElementById('modal-code-content-pre');
const modalCloseButton = document.getElementById('modal-close-button');
const modalCopyButton = document.getElementById('modal-copy-button');

// --- ADDED: Get Search DOM Elements ---
const searchInput = document.getElementById('search-input');
const noResultsMessage = document.getElementById('no-results-message');

// --- Modal Functions ---
function openCodeModal(title, description, code) {
    modalCodeTitle.textContent = title;
    modalCodeDescription.textContent = description;
    const codeElement = modalCodeContentPre.querySelector('code');
    codeElement.textContent = code;
    Prism.highlightElement(codeElement);
    viewCodeModal.classList.remove('hidden');
}

function closeCodeModal() {
    viewCodeModal.classList.add('hidden');
    modalCodeTitle.textContent = '';
    modalCodeDescription.textContent = '';
    modalCodeContentPre.querySelector('code').textContent = '';
}

// --- Card Button Handlers ---
function handleCopyCode(event) {
    const button = event.currentTarget;
    const pre = button.closest('.code-block-wrapper').querySelector('pre');
    const code = pre.querySelector('code').innerText;

    navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    }).catch(err => console.error('Failed to copy text: ', err));
}

async function loadSqlCodes() {
    const codeList = document.getElementById('code-list');
    codeList.innerHTML = '<p class="loading-message">Loading SQL codes...</p>';

    const { data: sqlCodes, error } = await supabase
        .from('queryhosxpsabot_sql_codes') // <-- EDITED
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching SQL codes:', error.message);
        codeList.innerHTML = '<p class="error-message">Failed to load SQL codes.</p>';
        return;
    }

    if (sqlCodes.length === 0) {
        codeList.innerHTML = '<p class="no-codes-message">No SQL codes available yet.</p>';
        return;
    }
    
    codeList.innerHTML = '';

    sqlCodes.forEach(code => {
        const codeCard = document.createElement('div');
        codeCard.classList.add('code-card');
        codeCard.innerHTML = `
            <div class="card-header">
                <h2>${code.title}</h2>
            </div>
            <p>${code.description || 'No description provided.'}</p>
            <div class="code-block-wrapper">
                <button class="copy-button">Copy</button>
                <pre><code class="language-sql">${code.code}</code></pre>
            </div>
            <button class="view-full-code-button">View Full Code</button>
            <small>Added on: ${new Date(code.created_at).toLocaleString()}</small>
        `;
        codeList.appendChild(codeCard);
    });

    // Add event listeners for all buttons
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', handleCopyCode);
    });
    
    document.querySelectorAll('.view-full-code-button').forEach(button => {
        const card = button.closest('.code-card');
        const pre = card.querySelector('pre');
        if (pre.scrollHeight > 200) {
            button.addEventListener('click', () => {
                const title = card.querySelector('h2').textContent;
                const description = card.querySelector('p').textContent;
                const code = card.querySelector('code').textContent;
                openCodeModal(title, description, code);
            });
        } else {
            button.style.display = 'none';
        }
    });

    Prism.highlightAll();
}

// --- ADDED: Search Filter Function ---
function filterCodes() {
    const searchTerm = searchInput.value.toLowerCase();
    const codeCards = document.querySelectorAll('#code-list .code-card');
    let visibleCount = 0;

    codeCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const codeContent = card.querySelector('code').textContent.toLowerCase();

        const isVisible = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          codeContent.includes(searchTerm);

        if (isVisible) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (visibleCount === 0 && searchTerm !== '') {
        noResultsMessage.classList.remove('hidden');
    } else {
        noResultsMessage.classList.add('hidden');
    }
}


// --- Global Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    modalCopyButton.innerHTML = copyIconSVG;
    loadSqlCodes();
    searchInput.addEventListener('input', filterCodes);
});
modalCloseButton.addEventListener('click', closeCodeModal);
viewCodeModal.addEventListener('click', (event) => {
    if (event.target === viewCodeModal) {
        closeCodeModal();
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !viewCodeModal.classList.contains('hidden')) {
        closeCodeModal();
    }
});
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