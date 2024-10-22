const API_BASE_URL = 'https://astracore-backend-8240e6a645dc.herokuapp.com';

// Pomocná funkce pro fetch
async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token'); // Předpokládáme, že token ukládáte do localStorage
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

// API funkce
export const api = {
    login: (credentials) => fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    register: (userData) => fetchWithAuth('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    getFinancialSummary: () => fetchWithAuth('/api/finance/summary'),

    // Přidejte další funkce pro různé API endpointy podle potřeby
};

export default api;