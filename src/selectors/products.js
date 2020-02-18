export default (products, search) => {
    return products.filter(product => {
        const codeMatch = product.productId.toLowerCase().includes(search.toLowerCase());
        const nameMatch = product.productName.toLowerCase().includes(search.toLowerCase());
        const codeCatMatch = product.categoryId.toLowerCase().includes(search.toLowerCase());
        const nameCatMatch = product.categoryName.toLowerCase().includes(search.toLowerCase());
        return codeMatch || nameMatch || codeCatMatch || nameCatMatch || search == ''
    })
    // .sort((a, b) => {
    //     return a.categoryId + a.productId > b.categoryId + b.productId ? 1 : -1;
    // });
}