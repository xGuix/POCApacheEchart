import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
})
export class ChartViewComponent implements AfterViewInit, OnChanges {
  @Input() chartId!: string;
  data: any[] = [];
  data2: any[] = [];
  isDarkMode = false;
  chart: any;
  darkColor!: string;
  lightColor!: string;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isDarkMode'] && this.chart) {
      this.updateBackgroundColor();
    }
  }

  ngAfterViewInit() {
    this.chart = echarts.init(document.getElementById(this.chartId));

    // Correction : Utilisez les noms de variables sans le signe `$`
    this.darkColor = getComputedStyle(
      this.elementRef.nativeElement
    ).getPropertyValue('--dark-theme-bkg');
    this.lightColor = getComputedStyle(
      this.elementRef.nativeElement
    ).getPropertyValue('--light-theme-bkg');
    console.log(this.darkColor);
    console.log(this.lightColor);

    this.initializeChartData();
    this.renderChart();

    setInterval(() => {
      this.updateChartData();
      this.renderChart();
    }, 300);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.chart) {
      this.updateBackgroundColor();
    }
  }

  private initializeChartData() {
    const currentTime = new Date();
    const oneMinuteEarlier = new Date(currentTime.getTime() - 60000);
    for (let i = 0; i < 1000; i++) {
      const date = new Date(oneMinuteEarlier.getTime() + i * 60);
      this.data.push([date, Math.floor(Math.random() * 30) + 30]);
      this.data2.push([date, Math.floor(Math.random() * 30) + 60]);
    }
  }

  private renderChart() {
    this.chart.setOption({
      title: {
        text: 'Data with Time Axis',
        textStyle: {
          color: this.isDarkMode ? '#eee' : '#aaa',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
        toolbar: true,
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: this.isDarkMode ? '#eee' : '#aaa',
            width: 2,
          },
        },
        axisTick: {
          linestyle: {
            color: this.isDarkMode ? '#eee' : '#aaa',
          },
        },
        axisLabel: {
          color: this.isDarkMode ? '#eee' : '#aaa',
          fontSize: 12,
          padding: [9, 0],
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: 10,
        max: 90,
        splitLine: {
          show: true,
        },
        axisLabel: {
          color: this.isDarkMode ? '#eee' : '#aaa',
        },
      },
      color: ['#72ccff', '#87f7cf'],
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          lineStyle: {
            width: 1.5,
          },
          smooth: true,
          animation: false,
          showSymbol: false,
          data: this.data,
        },
        {
          name: 'Fake Data 2',
          type: 'line',
          lineStyle: {
            width: 1.5,
          },
          smooth: true,
          animation: false,
          showSymbol: false,
          data: this.data2,
        },
      ],
    });
  }

  private randomData() {
    return [new Date(), Math.floor(Math.random() * 60) + 30];
  }

  private updateChartData() {
    if (this.data.length > 1000) {
      this.data.shift();
      this.data2.shift();
    }
    this.data.push(this.randomData());
    this.data2.push(this.randomData());
  }

  public updateBackgroundColor() {
    if (this.chart) {
      this.chart.setOption({
        backgroundColor: this.isDarkMode ? this.darkColor : this.lightColor,
        color: this.isDarkMode ? 'white' : 'black',
      });
    }
  }
}
