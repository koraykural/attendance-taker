import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { API_URL } from './shared/api.service';

const config: SocketIoConfig = {
  url: API_URL,
  options: { autoConnect: true, transports: ['websocket'] },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    SocketIoModule.forRoot(config),
    SharedModule,
    DashboardModule,
    AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
