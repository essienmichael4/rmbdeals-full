import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { OrderBilling } from "./OrderBillng.entity"
import { User } from "src/user/entities/user.entity"
export type Status = "CANCELLED" | "PENDING" | "HELD" | "COMPLETED"

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    account: string

    @Column()
    product: string

    @Column()
    currency: string

    @Column("float")
    rate: number

    @Column("float")
    amount: number

    @Column("float")
    rmbEquivalence: number

    @Column()
    recipient: string

    @Column()
    qrCode: string

    @Column({
        type: "enum",
        enum: ["CANCELLED", "PENDING", "HELD", "COMPLETED"]
    })
    status: Status

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(()=> User, (user) => user.orders, {cascade: true})
    user: User

    @OneToOne(()=> OrderBilling, (orderBilling)=> orderBilling.order, {cascade: true})
    @JoinColumn()
    orderBilling: OrderBilling
}
