export function hexToRgba(hex, alpha = 1) {
    const hexColor = hex.replace(/^#/, '');
    const bigint = parseInt(hexColor, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function deleteAllCookies() {
    // Получаем все куки, разделенные точкой с запятой
    const cookies = document.cookie.split(';');

    // Перебираем каждое куки
    cookies.forEach(cookie => {
        // Разбиваем куки на имя и значение
        const cookieParts = cookie.split('=');
        const cookieName = cookieParts[0].trim();

        // Устанавливаем срок действия куки в прошлое, чтобы удалить его
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
}
