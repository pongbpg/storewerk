export default (payments, search) => {
    return payments.filter(payment => {
        const codeMatch = payment.paymentId.toLowerCase().includes(search.toLowerCase());
        const nameMatch = payment.paymentName.toLowerCase().includes(search.toLowerCase());
        // const noMatch = payment.paymentId.toLowerCase().includes(search.toLowerCase());
        return codeMatch || nameMatch || paymentId || search == ''
    })
    // .sort((a, b) => {
    //     return a.paymentId > b.paymentId ? 1 : -1;
    // });
}