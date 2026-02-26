import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Show {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity()
export class Marque {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    announcement: string;

    @Column({ default: Show.FALSE })
    isShown: Show;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(()=> User, (user)=> user.marqueAnnouncements, {cascade: true})
    updatedBy: User
}
