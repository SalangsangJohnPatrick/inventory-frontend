import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './layouts/main-layout/dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ItemsComponent } from './layouts/main-layout/items/items.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportComponent } from './import/import.component';
import { CreateUpdateModalComponent } from './create-update-modal/create-update-modal.component';
import { NgbDropdownModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthInterceptor } from './auth-service/auth.interceptor';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    DashboardComponent,
    SidebarComponent,
    ItemsComponent,
    ImportComponent,
    CreateUpdateModalComponent,
    AuthenticationComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbDropdownModule,
    MatSortModule,
    MatIconModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass:  AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
