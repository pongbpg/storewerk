export default (accounts, search) => {
    return accounts.filter(account => {
        const accountIdMatch = account.accountId.toLowerCase().includes(search.toLowerCase());
        const accountNameMatch = account.accountName.toLowerCase().includes(search.toLowerCase());
        const accountTelMatch = account.accountTel.toLowerCase().includes(search.toLowerCase());
        const accountAddrMatch = account.accountAddr.toLowerCase().includes(search.toLowerCase());
        return accountIdMatch || accountNameMatch || accountTelMatch || accountAddrMatch || search == ''
    })
    // .sort((a, b) => {
    //     return a.accountName > b.accountName ? 1 : -1;
    // });
}