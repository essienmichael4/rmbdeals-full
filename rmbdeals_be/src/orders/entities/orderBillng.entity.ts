import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Order } from "./order.entity"

@Entity()
export class OrderBilling {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    whatsapp: string

    @Column()
    email: string

    @Column()
    momoName: string

    @Column()
    notes: string      
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(()=> Order, (order)=> order.orderBilling)
    order: Order
}
