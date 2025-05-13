export const convertVND = (price) => {
    const formattedNumber = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedNumber}đ`;
}