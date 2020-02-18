export default (members, search) => {
    return members.filter(member => {
        const codeMatch = member.memberId.toLowerCase().includes(search.toLowerCase());
        const nameMatch = member.memberName.toLowerCase().includes(search.toLowerCase());
        const telMatch = member.memberTel.toLowerCase().includes(search.toLowerCase());
        const addrMatch = member.memberAddr.toLowerCase().includes(search.toLowerCase());
        return codeMatch || nameMatch || telMatch || addrMatch || search == ''
    })
    // .sort((a, b) => {
    //     return a.memberName > b.memberName ? 1 : -1;
    // });
}