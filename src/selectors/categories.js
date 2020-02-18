export default (categories, search) => {
    return categories.filter(category => {
        const codeMatch = category.categoryId.toLowerCase().includes(search.toLowerCase());
        const nameMatch = category.categoryName.toLowerCase().includes(search.toLowerCase());
        return codeMatch || nameMatch || search == ''
    })
    // .sort((a, b) => {
    //     return a.categoryId > b.categoryId ? 1 : -1;
    // });
}