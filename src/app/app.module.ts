import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ChartViewComponent } from './chart-view/chart-view.component';
import { ChartDoubleViewComponent } from './chart-double-view/chart-double-view.component';
import { ChartTestingViewComponent } from './chart-double-view/chart-testing-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartViewComponent,
    ChartDoubleViewComponent,
    ChartTestingViewComponent,
  ],
  imports: [BrowserModule, CommonModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
