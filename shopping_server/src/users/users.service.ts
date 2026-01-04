import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {

  constructor(private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }
  findOne(id: number) {
    return this.userRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update({userId: id}, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.delete({userId: id});
  }
}
