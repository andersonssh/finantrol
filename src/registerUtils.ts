function getRegisterValue(register: Object) {
    if (register.isPercentage) {
        return register.percentageOn.reduce((acc, cur) => acc + cur.value, 0);
    }
    return register.value;
}
export { getRegisterValue };
