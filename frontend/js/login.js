// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await loginUser(username, password);
            if (response.success) {
                // Uložení tokenu do localStorage pro další použití
                localStorage.setItem('authToken', response.token);
                // Přesměrování na dashboard
                window.location.href = '../pages/dashboard.html';
            } else {
                showError(response.message);
            }
        } catch (error) {
            showError('Došlo k chybě při přihlašování. Zkuste to prosím znovu.');
        }
    });
});

async function loginUser(username, password) {
    // Zde by byla implementace volání API pro přihlášení
    // Pro demonstrační účely použijeme simulované API volání
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'password') {
                resolve({
                    success: true,
                    token: 'fakeAuthToken123',
                    message: 'Přihlášení úspěšné'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Nesprávné uživatelské jméno nebo heslo'
                });
            }
        }, 1000); // Simulace síťového zpoždění
    });
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    const loginBox = document.querySelector('.login-box');
    loginBox.insertBefore(errorElement, loginBox.firstChild);

    // Odstranění chybové zprávy po 5 sekundách
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}