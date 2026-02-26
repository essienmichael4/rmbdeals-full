import type { Dispatch } from "react"

interface Action {
    type: "ADD_AUTH" | "REMOVE_AUTH",
    payload?: AuthType
}

export type AnnouncementType = {
    title?:number,
    subject:string,
    show: string
}

export type AuthType = {
    name: string,
    email: string,
    phone?: string,
    role?: string,
    id: number | undefined,
    backendTokens: {
        accessToken: string,
        refreshToken: string
    }
}

export type AuthContextType = {
    auth: AuthType | undefined,
    dispatch: Dispatch<Action>;
}

export type Client = {
    id: number,
    name?: string,
    email: string,
    phone?: string,
    createdAt?: string,
    updatedAt?:string,
}

export type Currency = {
    rate:number,
    label:string,
    description:string,
    currency: string
}

export type MarqueAnnouncementType = {
    id: number,
    announcement:string,
    isShown: string
}

export type Order = {
    id:number,
    account:string,
    product:string,
    currency: string,
    rate: number,
    amount: number,
    rmbEquivalence: number,
    recipient: string,
    status?: string,
    createdAt?: string,
    qrCode?: string,
    orderBilling?:OrderBilling
}

export type OrderBilling = {
    email: string
    momoName:string
    name: string
    notes: string
    whatsapp: string
}

export type PaymentType = {
    number:string,
    name:string
}

export type Revenue = {
    completedRevenue:RevenueCurrency[],
    heldRevenue: RevenueCurrency[]
}

export type RevenueCurrency = {
    currency: string,
    totalRevenue: number
}

export type Stats = {
    totalOrders:number,
    successfulOrders: number,
    heldOrders: number,
    cancelledOrders?: number,
    projectedExpense: number,
    successfulExpense:number,
    heldExpense: number
}
