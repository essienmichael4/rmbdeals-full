import { User } from "src/user/entities/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
export enum Show {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity()
export class Announcement {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: true
    })
    title: string

    @Column()
    subject: string

    @Column({ default: Show.FALSE })
    show: Show

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(()=> User, (user)=> user.announcements, {cascade: true})
    updatedBy: User
}
