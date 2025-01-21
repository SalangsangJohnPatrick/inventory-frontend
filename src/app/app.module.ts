import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ItemsComponent } from './items/items.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddItemComponent } from './modals/add-item/add-item.component';
import { ImportComponent } from './modals/import/import.component';
import { ModalsComponent } from './modals/modals.component';
import { UpdateItemComponent } from './modals/update-item/update-item.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    DashboardComponent,
    SidebarComponent,
    ItemsComponent,
    AddItemComponent,
    ImportComponent,
    ModalsComponent,
    UpdateItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
