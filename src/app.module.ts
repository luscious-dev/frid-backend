import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './modules/event/event.controller';
import { RegistrationController } from './modules/registration/registration.controller';
import { RegistrationModule } from './modules/registration/registration.module';
import { EventService } from './modules/event/event.service';
import { EventModule } from './modules/event/event.module';
import { RegistrationService } from './modules/registration/registration.service';

@Module({
  imports: [RegistrationModule, EventModule],
  controllers: [AppController, EventController, RegistrationController],
  providers: [AppService, EventService, RegistrationService],
})
export class AppModule { }
