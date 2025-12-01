import { Module } from '@nestjs/common';
import { HttpModule } from '@proj/http/src/http.module';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
