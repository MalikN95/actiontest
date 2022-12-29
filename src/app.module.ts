import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { SeedsModule } from 'modules/seeds/seeds.module';
import { SubscriptionModule } from 'modules/subscription/subscription.module';
import { BusinessModule } from 'modules/business/business.module';
import { ConfigurationModule } from 'modules/configuration/configuration.module';
import { FilesModule } from 'modules/files/files.module';
import { InformationModule } from 'modules/information/information.module';
import { ServicesModule } from 'modules/services/services.module';
import { ExploreModule } from 'modules/explore/explore.module';
import { BookingsModule } from 'modules/bookings/bookings.module';
import { ChatModule } from 'modules/chat/chat.module';
import { ChatSettingsModule } from 'modules/chat-settings/chat-settings.module';
import { UserBusinessRoleModule } from 'modules/user-business-role/user-business-role.module';
import config from 'conf/conf';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: config,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    SeedsModule,
    SubscriptionModule,
    BusinessModule,
    ConfigurationModule,
    FilesModule,
    InformationModule,
    ServicesModule,
    ExploreModule,
    BookingsModule,
    ChatModule,
    ChatSettingsModule,
    UserBusinessRoleModule,
  ],
  controllers: [],
})
export class AppModule {}
