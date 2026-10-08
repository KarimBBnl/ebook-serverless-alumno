const API_URL = 'https://m5vxqfwc3m.execute-api.us-east-1.amazonaws.com/dev/contact';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.ebook-download-form');
    const nameInput = document.getElementById('ebook-form-name');
    const emailInput = document.getElementById('ebook-email');
    const status = document.getElementById('ebook-form-status');
    const submitButton = form?.querySelector('button[type="submit"]');

    if (!form || !nameInput || !emailInput || !status || !submitButton) {
        console.error('No se pudo inicializar el formulario: faltan elementos requeridos.');
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!API_URL) {
            status.textContent = 'API Gateway aún no está configurada. No se ha enviado el formulario.';
            console.error('Configura API_URL en js/api.js con la URL real de API Gateway que termina en /dev/contact.');
            return;
        }

        status.textContent = 'Enviando solicitud…';
        submitButton.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim()
                })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || `La API respondió con HTTP ${response.status}.`);
            }

            status.textContent = result.message || 'Solicitud enviada correctamente.';
            form.reset();
        } catch (error) {
            console.error('No se pudo enviar la solicitud a API Gateway:', error);
            status.textContent = `No se pudo enviar la solicitud: ${error.message}`;
        } finally {
            submitButton.disabled = false;
        }
    });
});
