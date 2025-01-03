/* eslint-disable prettier/prettier */
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { UserService } from "src/service/user.service";
import { User } from "src/entity/user.entity";
import { CreateUserDto } from "src/dto/userDtos/createUser.dto";
import { UpdateUserDto } from "src/dto/userDtos/updateUser.dto";
import { PaginationDto } from "src/dto/paginationDto/pagination.dto";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        try{
            return await this.userService.create(createUserDto);
        }
        catch(err){
            console.log(err);
        }
    }

    @Get('/paginator')
    async paginator(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
        @Query('limit', new DefaultValuePipe(10),  ParseIntPipe) limit: 10,
    ): Promise<Pagination<User>> {
        const options: IPaginationOptions = {
          page: page,
          limit: limit,
        };
        return await this.userService.paginate(options);
    }
        
    @Get("/paginated")
    async getAllUser(
        // @Query('page', ParseIntPipe) page: number,
        // @Query('limit', ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: 1,
        @Query('limit', new DefaultValuePipe(10),  ParseIntPipe) limit: 10,
    ): Promise<{data: User[], total: number, page: number, limit: number}> 
    {
        try{
            const {data, total} = await this.userService.findAllUsers(page, limit);
            return {data, total, page, limit};
        }
        catch(err){
            console.log(err);
        }
    }

    @Get('/pagination')
    async getAll(@Query() paginationDto: PaginationDto): Promise<{ data: User[]; total: number }> {
      return await this.userService.getAll(paginationDto);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return await this.userService.findOne(id);
    }

    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDto): Promise<User> 
    {
        return await this.userService.update(id, payload);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return await this.userService.delete(id);
    }

    @Delete('/permenet-delete/:id')
    async permenetDelete(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return await this.userService.permenetDelete(id);
    }

}