export interface Register {
    _id: string;
    description: string;
    category: string;
    isRequired: boolean;
    isPercentage: boolean;
    isPaid: boolean;
    percentageOn: Array<Register>;
    value: number;
}

export function getRegisterValue(register: Register) {
    if (register.isPercentage) {
        return register.percentageOn.reduce((acc, cur) => acc + cur.value, 0);
    }
    return register.value;
}

export function getTotal(registers: Array<Register>){
    let sumEntries = getEntries(registers).reduce(
        (acc, reg) => acc + getRegisterValue(reg), 0)
    let sumExits = getExits(registers).reduce(
        (acc, reg) => acc + getRegisterValue(reg), 0)
    return sumEntries - sumExits
}


export function getEntries(registers: Array<Register>){
    return registers.filter((reg) => !isExpense(reg))
}

export function getExits(registers: Array<Register>){
    return registers.filter((reg) => isExpense(reg))
}


export function isExpense(register: Register){
    return register.category != "entradas"
}