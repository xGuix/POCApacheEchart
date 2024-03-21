import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ChartViewComponent } from './chart-view/chart-view.component';
import { ChartDoubleViewComponent } from './chart-double-view/chart-double-view.component';

@NgModule({
  declarations: [AppComponent, ChartViewComponent, ChartDoubleViewComponent],
  imports: [BrowserModule, CommonModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
