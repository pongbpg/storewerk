export default (warehouses, search) => {
    return warehouses.filter(warehouse => {
        const codeMatch = warehouse.warehouseId.toLowerCase().includes(search.toLowerCase());
        const nameMatch = warehouse.warehouseName.toLowerCase().includes(search.toLowerCase());
        return codeMatch || nameMatch || search == ''
    })
    // .sort((a, b) => {
    //     return a.warehouseId > b.warehouseId ? 1 : -1;
    // });
}