export function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Loại bỏ dấu
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
} 