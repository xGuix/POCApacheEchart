import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ChartViewComponent } from './chart-view/chart-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartViewComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
