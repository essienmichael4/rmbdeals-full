import { IsString } from 'class-validator';
import { Status } from '../entities/order.entity';

export class UpdateOrderDto {
    @IsString()
    status: Status
}
