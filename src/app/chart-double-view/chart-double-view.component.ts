import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';

@Component({
  selector: 'app-chart-double-view',
  templateUrl: './chart-double-view.component.html',
  styleUrls: ['./chart-double-view.component.scss'],
})
export class ChartDoubleViewComponent implements AfterViewInit {
  @Input() chartId!: string;
  data1: any[] = [];
  data2: any[] = [];
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
      this.data1.push([date, randomValue]);
      this.data2.push([date, randomValue]);
    }
  }

  private renderChart() {
    this.chart.setOption({
      darkMode: 'auto',
      backgroungColor: this.isDarkMode ? this.lightColor : this.darkColor,
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
            yAxisIndex: [0, 1],
          },
          dataView: {
            show: true,
            readOnly: true,
            title: 'Data View',
          },
          restore: {},
          saveAsImage: {
            show: true,
            title: "Export l'image",
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
          show: true,
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
      yAxis: [
        {
          type: 'value',
          position: 'left',
          boundaryGap: [0, 0],
          //min: -150,
          //max: 10,
          splitLine: {
            show: true,
          },
          axisLabel: {
            color: this.isDarkMode ? this.lightColor : this.darkColor,
            formatter: '{value} db',
          },
        },
        {
          yAxis: {
            type: 'value',
            position: 'right',
            min: 0,
            max: 360,
            splitLine: {
              show: true,
            },
            axisLabel: {
              color: this.isDarkMode ? this.lightColor : this.darkColor,
              formatter: '{value}°',
            },
          },
        },
      ],
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
          name: 'Fake decibel signal',
          type: 'line',
          lineStyle: {
            width: 1.2,
          },
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
          name: 'Fake degres position',
          type: 'line',
          lineStyle: {
            width: 1.2,
          },
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
          tooltip: {
            show: true,
          },
        },
      ],
    });
  }

  private randomData(adjust: number) {
    return [new Date(), Math.floor(Math.random() * 20) - 10 + adjust];
  }

  private fonctionSinusoidale(x: number) {
    return [new Date(), -50 + 10 * Math.sin(0.3 * x) + 0.6 * Math.cos(1 * x)];
  }

  private updateChartData() {
    if (this.data1.length > 1000) {
      this.data1.shift();
      this.data2.shift();
    }
    this.data1.push(this.randomData(+10));
    this.data2.push(this.randomData(-10));
  }
}
