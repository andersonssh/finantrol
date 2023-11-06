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

