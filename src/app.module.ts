import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AirQualityModule } from "@/modules/air-quality/air-quality.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "@/shared/database/database.module";
import { AxiosModule } from "./shared/axios/axios.module";
import config from "@/shared/config";
import { HttpModule } from "@nestjs/axios";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GlobalExceptionInterceptor } from "@/shared/interceptors";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ".env",
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    AirQualityModule,
    HttpModule,
    AxiosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalExceptionInterceptor,
    },
  ],
})
export class AppModule {}
