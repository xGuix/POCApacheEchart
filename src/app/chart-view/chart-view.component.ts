import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
})
export class ChartViewComponent implements AfterViewInit {
  @Input() chartId!: string;
  data1: any[] = [];
  data2: any[] = [];
  data3: any[] = [];
  chart: any;
  isDarkMode = false;
  darkColor!: string;
  lightColor!: string;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.chart = echarts.init(document.getElementById(this.chartId));

    // Accéder à l'élément DOM du composant
    const element = this.elementRef.nativeElement;
    this.darkColor =
      getComputedStyle(element).getPropertyValue('--dark-theme-bkg');
    this.lightColor =
      getComputedStyle(element).getPropertyValue('--light-theme-bkg');

    this.initializeChartData();
    this.renderChart();

    setInterval(() => {
      this.updateChartData();
      this.renderChart();
    }, 300);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  private initializeChartData() {
    const currentTime = new Date();
    const oneMinuteEarlier = new Date(currentTime.getTime() - 60000);
    for (let i = 0; i < 1000; i++) {
      const date = new Date(oneMinuteEarlier.getTime() + i * 60);
      const randomValue = Math.floor(Math.random() * 2) - 1;
      this.data1.push([date, randomValue + 15]);
      this.data2.push([date, randomValue + 0]);
      this.data3.push([date, randomValue - 15]);
    }
  }

  private renderChart() {
    this.chart.setOption({
      color: ['#72ccff', '#87f7cf', ' #fc97af'],
      title: {
        text: 'Temperature with Time Axis',
        textStyle: {
          color: this.isDarkMode ? this.lightColor : this.darkColor,
        },
      },
      legend: {
        type: 'plain',
        show: true,
        right: 30,
        orient: 'horizontal',
        align: 'left',
        textStyle: {
          color: this.isDarkMode ? this.lightColor : this.darkColor,
        },
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          dataView: {
            show: true,
            readOnly: true,
            title: 'Data View',
          },
          restore: {},
          saveAsImage: {
            show: true,
            title: 'Export Image',
          },
        },
        iconStyle: {
          borderColor: this.isDarkMode ? this.lightColor : this.darkColor,
        },
        top: 125,
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: this.isDarkMode ? this.lightColor : this.darkColor,
            width: 1,
          },
        },
        axisTick: {
          linestyle: {
            color: this.isDarkMode ? this.lightColor : this.darkColor,
          },
        },
        axisLabel: {
          color: this.isDarkMode ? this.lightColor : this.darkColor,
          fontSize: 12,
          padding: [9, 0],
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0],
        //min: -30,
        //max: 30,
        splitLine: {
          show: true,
        },
        axisLabel: {
          color: this.isDarkMode ? this.lightColor : this.darkColor,
          formatter: '{value} °C',
        },
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          axis: 'auto',
          label: {
            show: true,
          },
        },
      },
      series: [
        {
          name: 'Fake Temperature 1',
          type: 'line',
          lineStyle: {
            width: 1.2,
          },
          areaStyle: {},
          smooth: true,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.data1,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
            label: {
              color: '#bbb',
              borderWidth: 0,
            },
          },
          tooltip: {
            show: true,
          },
        },
        {
          name: 'Fake Temperature 2',
          type: 'line',
          lineStyle: {
            width: 1.2,
          },
          areaStyle: {},
          smooth: true,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.data2,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
            label: {
              color: '#bbb',
              borderWidth: 0,
            },
          },
          stack: 'temperature',
          tooltip: {
            show: true,
          },
        },
        {
          name: 'Fake Temperature 3',
          type: 'line',
          lineStyle: {
            width: 1.2,
          },
          areaStyle: {},
          smooth: true,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.data3,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
            label: {
              color: '#bbb',
              borderWidth: 0,
            },
          },
          stack: 'temperature',
          tooltip: {
            show: true,
          },
        },
      ],
    });
  }

  private randomData(adjust: number) {
    return [new Date(), Math.floor(Math.random() * 10) - 5 + adjust];
  }

  private updateChartData() {
    if (this.data1.length > 1000) {
      this.data1.shift();
      this.data2.shift();
      this.data3.shift();
    }
    this.data1.push(this.randomData(+15));
    this.data2.push(this.randomData(0));
    this.data3.push(this.randomData(-15));
  }
}
