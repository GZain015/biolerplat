import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/controller/user.controller";
import { PasswordLink } from "src/entity/PasswordLink.entity";
import { User } from "src/entity/user.entity";
import { UserService } from "src/service/user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, PasswordLink]),
        ScheduleModule.forRoot(),
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}