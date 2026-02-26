import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    number: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(()=> User, (user) => user.accounts)
    updatedBy: User
}
