export default (taxid='') => {
    let i = 0, sum = 0;
    if (taxid.length != 13) return false;
    for (i = 0, sum = 0; i < 12; i++)
        sum += parseFloat(taxid.charAt(i)) * (13 - i);
    if ((11 - sum % 11) % 10 != parseFloat(taxid.charAt(12)))
        return false; return true;
}