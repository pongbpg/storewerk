export default (branches, search) => {
    return branches.filter(branch => {
        const codeMatch = branch.branchId.toLowerCase().includes(search.toLowerCase());
        const nameMatch = branch.branchName.toLowerCase().includes(search.toLowerCase());
        return codeMatch || nameMatch || search == ''
    })
    // .sort((a, b) => {
    //     return a.branchId > b.branchId ? 1 : -1;
    // });
}