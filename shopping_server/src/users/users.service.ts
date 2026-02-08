import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CartsService } from 'src/carts/carts.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)//עטיפה בריפוזיטורי של typeorm
    private usersRepository: Repository<User>,
    private cartsService: CartsService,
  ) { }



  //יצירת משתמש פלוס הצפנת סיסמא
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);


    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    await this.cartsService.create(savedUser.user_id);//יצירת עגלה ריקה למשתמש החדש
    return savedUser;
  }

  async findOrCreateOAuthUser(
    email: string,
    provider: string,
    profile: any,
  ): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      if (provider === 'google' && !user.google_id) {
        user.google_id = profile.id;
        return await this.usersRepository.save(user);
      }
      return user;
    }
    user = this.usersRepository.create({
      email,
      first_name: profile.firstName,
      last_name: profile.lastName,
      picture: profile.picture,
      provider,
      google_id: provider === 'google' ? profile.id : null,
    });
    const savedUser = await this.usersRepository.save(user);
    await this.cartsService.create(savedUser.user_id); // יצירת עגלה ריקה למשתמש החדש  גוגל
    return savedUser;
  }



  findAll() {
    return this.usersRepository.find();
  }

  findAllWithDeleted() {
    return this.usersRepository.find({ withDeleted: true });
  }

  async restore(id: number) {
    await this.usersRepository.restore({ user_id: id });
    return this.usersRepository.findOne({ where: { user_id: id } });
  }

  async findById(userId: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { user_id: userId } });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update({ user_id: userId }, updateUserDto);
    return this.findById(userId);
  }

  async remove(id: number) {
    await this.usersRepository.softDelete({ user_id: id });
  }
}
