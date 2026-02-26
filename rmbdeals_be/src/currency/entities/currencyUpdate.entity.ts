import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from "typeorm"
import { Currency } from "./currency.entity";

@Entity()
export class CurrencyUpdate {
    @PrimaryGeneratedColumn()
    id: number

    @Column("float")
    currentRate: number

    @Column("float")
    previousRate: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(()=> User, (user) => user.currencyUpdates, {cascade: true})
    updatedBy: User

    @ManyToOne(()=> Currency, (currency) => currency.currencyUpdates, {cascade: true})
    currency: Currency
}
