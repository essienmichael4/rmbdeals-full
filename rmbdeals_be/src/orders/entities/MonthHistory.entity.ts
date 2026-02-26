import { Entity, Column, PrimaryColumn } from "typeorm"
export type Status = "CANCELLED" | "PENDING" | "HELD" | "COMPLETED"

@Entity()
export class MonthHistory {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    day: number;

    @PrimaryColumn()
    month: number;

    @PrimaryColumn()
    year: number;

    @Column()
    orders: number;

    @Column("float")
    expense: number;
}
