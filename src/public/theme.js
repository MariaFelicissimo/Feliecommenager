function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') !== 'dark';
    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
    const button = document.getElementById('btnTheme');
    if (button) button.textContent = isDark ? '☀️' : '🌙';
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        const button = document.getElementById('btnTheme');
        if (button) button.textContent = '☀️';
    }
});
