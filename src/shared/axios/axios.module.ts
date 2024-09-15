import { Logger, Module } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  providers: [AxiosService, Logger],
  exports: [AxiosService],

})
export class AxiosModule { }
