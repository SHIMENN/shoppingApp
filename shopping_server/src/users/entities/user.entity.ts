import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { IsEmail,Min } from 'class-validator';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @IsEmail()
    email: string;


    @Column()
    @Min(8)
    password: string;
}

