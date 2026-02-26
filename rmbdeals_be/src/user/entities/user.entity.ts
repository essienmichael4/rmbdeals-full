import { Account } from "src/account/entities/account.entity";
import { Announcement } from "src/announcement/entities/announcement.entity";
import { Marque } from "src/announcement/entities/marque.entity";
import { Currency } from "src/currency/entities/currency.entity";
import { CurrencyUpdate } from "src/currency/entities/CurrencyUpdate.entity";
import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    SUPERADMIN = 'SUPERADMIN'
}

@Entity({name: "user"})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name:string

    @Column({nullable: true})
    searchName:string

    @Column({
        default: "GHS"
    })
    currency: string
    
    @Column({ unique: true })
    email:string

    @Column()
    password:string

    @Column({nullable: true})
    phone:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @Column({ default: Role.USER })
    role: Role;

    @OneToMany(()=> Announcement, (announcement) => announcement.updatedBy)
    announcements: Announcement[]

    @OneToMany(()=> Marque, (marque) => marque.updatedBy)
    marqueAnnouncements: Marque[]

    @OneToMany(()=> Account, (account) => account.updatedBy)
    accounts: Account[]

    @OneToMany(()=> Order, (order) => order.user)
    orders: Order[]

    @OneToMany(()=> Currency, (currency) => currency.addedBy) 
    currencies: Currency[]

    @OneToMany(()=> CurrencyUpdate, (currencyUpdate) => currencyUpdate.updatedBy)
    currencyUpdates: CurrencyUpdate[]
}
