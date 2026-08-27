// Tema Dark/Light
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
});

// Lógica de Cálculo e Exibição do Modal
async function realizarTeste() {
    const nome = document.getElementById('name').value;
    const custo = document.getElementById('costPrice').value;
    const margem = document.getElementById('markup').value;
    const mkt = document.getElementById('marketplace').value;

    if (!nome || !custo || !margem) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch('/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nome,
                costPrice: Number(custo),
                markup: Number(margem),
                marketplace: mkt
            })
        });

        const produto = await response.json();

        document.getElementById('resultadoTeste').innerHTML = `
            <div style="background: var(--primary); color: white; padding: 15px; border-radius: 10px;">
                <p style="margin:0">Preço Sugerido:</p>
                <strong style="font-size: 1.8rem;">R$ ${produto.suggestedPrice}</strong>
            </div>
        `;

        // Ativa o modal centralizado (usando flex para alinhar)
        setTimeout(() => {
            const modal = document.getElementById('authModal');
            modal.style.display = 'flex'; 
        }, 3000);

    } catch (err) {
        alert("Erro ao conectar com o servidor.");
    }
}