export interface Register {
    _id: string;
    description: string;
    category: string;
    isRequired: boolean;
    isPercentage: boolean;
    isPaid: boolean;
    isHidden: boolean;
    percentageOn: Array<Register>;
    value: number;
}

export const categories = [
    "entradas",
    "casa",
    "comida",
    "contas",
    "educação",
    "entretenimento",
    "hortifruti",
    "investimentos",
    "lazer",
    "livre",
    "outros",
    "proteínas",
    "saúde",
    "transporte",
    "viagem",
]

export function getSortedRegisters(registers: Array<Register>){
    if(registers.length === 0) return []

    let sortedRegisters: Register[] = []
    for(let category of categories){
        let selectedRegisters: Register[] = registers.filter((reg) => reg.category == category)
        selectedRegisters.sort((a, b) => getRegisterValue(b) - getRegisterValue(a))
        sortedRegisters.push(...selectedRegisters)
    }
    return sortedRegisters
}


export function getTotal(registers: Array<Register>){
    let sumEntries = getEntries(registers).reduce(
        (acc, reg) => acc + getRegisterValue(reg), 0)
    let sumExits = getExits(registers).reduce(
        (acc, reg) => acc + getRegisterValue(reg), 0)
    return Number((sumEntries - sumExits).toFixed(2));
}


export function getRegisterValue(register: Register) {
    if (register.isPercentage) {
        return register.percentageOn.reduce((acc, cur) => acc + cur.value, 0);
    }
    return register.value;
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