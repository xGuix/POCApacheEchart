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
  dataSignal: any[] = [];
  dataPosition: any[] = [];
  dataElevation: any[] = [];
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
      const pastDate = new Date(oneMinuteEarlier.getTime() + i * 60);
      this.dataSignal.push([
        pastDate,
        Math.round(
          -30 +
            60 * Math.sin(0.1 * pastDate.getTime()) +
            Math.cos(3 * pastDate.getTime())
        ),
      ]);
      this.dataPosition.push([
        pastDate,
        Math.round(
          180 +
            10 * Math.sin(0.1 * pastDate.getTime()) +
            Math.cos(0.9 * pastDate.getTime())
        ),
      ]);
      this.dataElevation.push([
        pastDate,
        Math.round(
          45 +
            5 * Math.sin(0.1 * pastDate.getTime()) +
            Math.cos(0.9 * pastDate.getTime())
        ),
      ]);
    }
  }

  private renderChart() {
    this.chart.setOption({
      color: ['#72ccff', ' #fc97af', '#87f7cf'],
      title: {
        text: 'DECIBELS & DEGREES AXIS',
        left: 24,
        textStyle: {
          color: this.isDarkMode ? this.lightColor : this.darkColor,
        },
      },
      legend: {
        type: 'plain',
        show: true,
        right: 24,
        orient: 'horizontal',
        align: 'left',
        textStyle: {
          color: this.isDarkMode ? this.lightColor : this.darkColor,
        },
      },
      grid: {
        top: 84,
        left: 90,
        width: 690,
        height: 300,
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
        top: 135,
        right: 15,
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
          show: true,
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
          name: 'SIGNAL',
          type: 'value',
          position: 'left',
          alignTicks: false,
          boundaryGap: [0, 0],
          //min: -150,
          //max: 10,
          scale: true,
          interval: 30,
          splitLine: {
            show: false,
            opacity: 0.5,
          },
          axisLine: {
            show: false,
            onZero: false,
            symbol: 'arrow',
            symbolSize: [6, 6],
          },
          axisLabel: {
            color: this.isDarkMode ? this.lightColor : this.darkColor,
            formatter: '{value} db',
          },
        },
        {
          name: 'POSITION',
          type: 'value',
          position: 'right',
          alignTicks: false,
          min: 0,
          max: 360,
          scale: true,
          interval: 90,
          splitLine: {
            show: true,
            opacity: 0.5,
          },
          axisLine: {
            show: false,
            onZero: false,
            symbol: 'arrow',
            symbolSize: [6, 6],
          },
          axisLabel: {
            color: this.isDarkMode ? this.lightColor : this.darkColor,
            formatter: '{value}°',
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
          name: 'Fake signal',
          type: 'line',
          lineStyle: {
            width: 1.2,
          },
          areaStyle: {
            opacity: 0.3,
          },
          smooth: true,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.dataSignal,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [
              {
                type: 'average',
                name: 'Avg',
              },
            ],
            label: {
              position: 'insideMiddleTop',
              fontSize: 13,
              color: this.isDarkMode ? this.lightColor : this.darkColor,
              borderWidth: 0,
            },
          },
          tooltip: {
            show: true,
          },
        },
        {
          name: 'Fake azimut',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            width: 1.2,
          },
          smooth: true,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.dataPosition,
          markPoint: {
            symbolSize: 60,
            label: {
              fontWeight: '600',
              fontSize: 10,
              color: '#fff',
            },
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [
              {
                type: 'average',
                name: 'Avg',
              },
            ],
            label: {
              position: 'insideMiddleTop',
              fontSize: 13,
              color: this.isDarkMode ? this.lightColor : this.darkColor,
              borderWidth: 0,
            },
          },
          tooltip: {
            show: true,
          },
        },
        {
          name: 'Fake elevation',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            width: 1.2,
          },
          smooth: true,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.dataElevation,
          markPoint: {
            symbolSize: 60,
            label: {
              fontWeight: '600',
              fontSize: 10,
              color: '#fff',
            },
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [
              {
                type: 'average',
                name: 'Avg',
              },
            ],
            label: {
              position: 'insideMiddleTop',
              fontSize: 13,
              color: this.isDarkMode ? this.lightColor : this.darkColor,
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

  private fonctionSinusoidale(position: number, amplitude: number) {
    const date = new Date();
    const traceLine =
      position +
      amplitude * Math.sin(0.1 * date.getTime()) +
      Math.cos(3 * date.getTime());
    return [date, Math.round(traceLine)];
  }

  private updateChartData() {
    if (this.dataPosition.length > 1000) {
      this.dataSignal.shift();
      this.dataPosition.shift();
      this.dataElevation.shift();
    }
    this.dataSignal.push(this.fonctionSinusoidale(-30, 90));
    this.dataPosition.push(this.fonctionSinusoidale(180, 10));
    this.dataElevation.push(this.fonctionSinusoidale(45, 5));
  }
}
