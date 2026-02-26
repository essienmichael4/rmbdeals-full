export const Accounts: {value:"personal" | "supplier", label: string}[] = [
    {value: "personal", label: "Personal"},
    {value: "supplier", label: "Supplier"},
]

export type Account = (typeof Accounts)[0]
