/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { PaginationDto } from "src/dto/paginationDto/pagination.dto";
import { CreateUserDto } from "src/dto/userDtos/createUser.dto";
import { UpdateUserDto } from "src/dto/userDtos/updateUser.dto";
import { PasswordLink } from "src/entity/PasswordLink.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

Injectable();
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(PasswordLink)
        private passwordLinkRepository: Repository<PasswordLink>,
    ) {}

    // async create(createUserDto: CreateUserDto): Promise<User> {
    //     const newUser = this.usersRepository.create(createUserDto);
    //     return await this.usersRepository.save(newUser);
    // }
    
    async create(createUserDto: CreateUserDto): Promise<User> {
        
        const user = new User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        user.isActive = createUserDto.isActive;
    
        console.log(user);
    
        // Handle password links if provided
        if (createUserDto.passwordLinks) {
            console.log("createUserDto: " + createUserDto);

            const passwordLinks = createUserDto.passwordLinks.map(link => {
              const passwordLink = new PasswordLink();
              passwordLink.user = user; 
              passwordLink.userId = String(user.id); 
              return passwordLink;
            });
    
            await this.passwordLinkRepository.save(passwordLinks);
            user.passwordLinks = passwordLinks; 
        }
    
        // Save user to the database
        const savedUser = await this.usersRepository.save(user);
        return savedUser;
    }

    async saveUser(user: User): Promise<User> {
        return await this.usersRepository.save(user);
    }


    async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
        const queryBuilder = this.usersRepository.createQueryBuilder('user');
        // queryBuilder.leftJoinAndSelect('user.posts', 'post');
        // queryBuilder.where('user.isActive = :isActive', { isActive: true });
        // queryBuilder.orderBy('user.id', 'DESC');
        queryBuilder.orderBy('user.id', 'ASC');
        return paginate<User>(queryBuilder, options);
    }

    async getAll(paginationDto: PaginationDto): Promise<{ data: User[]; total: number }> {
        const { page = 1, limit = 10 } = paginationDto;
    
        const [data, total] = await this.usersRepository.findAndCount({
          skip: (page - 1) * limit,
          take: limit,
        });
    
        return { data, total };
    } 

    async findAllUsers(
        page: number,
        limit: number,
      ): Promise<{ data: User[]; total: number }> {
        try {
          const [data, total] = await this.usersRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
          });
          return { data, total };
        } catch (error) {
          throw new HttpException('Error fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return this.usersRepository.findOne({ where: {id} });
        // return this.usersRepository.findOneBy({id});
    }

    async getUserByEmail(email: string) {
        return this.usersRepository.findOne({
             where: {
                  email
             }
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.usersRepository.update(id, updateUserDto);
        return this.usersRepository.findOne({ where: {id} });
    }

    async delete(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: {id} });
        await this.usersRepository.remove(user);
        return user;
    }
    

    async permenetDelete(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: {id} });
        await this.usersRepository.delete(id);
        return user;
    }
    
}