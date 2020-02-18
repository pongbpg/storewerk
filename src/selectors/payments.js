export default (payments, search) => {
    return payments.filter(payment => {
        const codeMatch = payment.paymentId.toLowerCase().includes(search.toLowerCase());
        const nameMatch = payment.paymentName.toLowerCase().includes(search.toLowerCase());
        const noMatch = payment.paymentNo.toLowerCase().includes(search.toLowerCase());
        return codeMatch || nameMatch || paymentNo || search == ''
    })
    // .sort((a, b) => {
    //     return a.paymentId > b.paymentId ? 1 : -1;
    // });
}