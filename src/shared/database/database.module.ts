import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: "mysql",
          host: configService.get("database.host"),
          port: configService.get("database.port"),
          username: configService.get("database.username"),
          password: configService.get("database.password"),
          database: configService.get("database.name"),
          entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
          options: {
            trustServerCertificate: true,
          },
          logging: true,
          synchronize: false,
          migrations: [join(__dirname, "/migrations/**/*{.ts,.js}")],
          migrationsTableName: "typeorm_migrations",
          migrationsRun: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
