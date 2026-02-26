import { User } from "src/user/entities/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { CurrencyUpdate } from "./CurrencyUpdate.entity"

@Entity()
export class Currency {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    currency: string

    @Column()
    label: string

    @Column("float")
    rate: number

    @Column({
        nullable: true
    })
    description: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(()=> User, (user) => user.currencies, {cascade: true})
    addedBy: User

    @OneToMany(()=> CurrencyUpdate, (currencyUpdate) => currencyUpdate.updatedBy)
    currencyUpdates: CurrencyUpdate[]
}
