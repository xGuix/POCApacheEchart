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

  private fonctionSinusoidale(date: Date, position: number, amplitude: number) {
    const traceLine =
      position +
      amplitude *
        (2 * Math.sin(0.00006 * date.getTime()) +
          Math.cos(0.0008 * date.getTime()) +
          (Math.random() - 0.5) / 2);
    return [date, Math.round(traceLine * 10) / 10];
  }

  private initializeChartData() {
    const currentTime = new Date();
    const oneMinuteEarlier = new Date(currentTime.getTime() - 60000);
    for (let i = 0; i < 1000; i++) {
      const pastDate = new Date(oneMinuteEarlier.getTime() + i * 60);
      this.dataSignal.push(this.fonctionSinusoidale(pastDate, -30, 12));
      this.dataPosition.push(this.fonctionSinusoidale(pastDate, 180, 6));
      this.dataElevation.push(this.fonctionSinusoidale(pastDate, 45, 3));
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
            width: 0.6,
            opacity: 0.5,
          },
        },
        axisTick: {
          show: true,
          linestyle: {
            color: this.isDarkMode ? this.lightColor : this.darkColor,
            width: 0.6,
            opacity: 0.6,
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
            symbolSize: 75,
            label: {
              formatter: '{c} db',
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
            precision: 1,
            data: [
              {
                type: 'average',
                name: 'Avg',
              },
            ],
            label: {
              formatter: '{c} db',
              position: 'insideMiddleTop',
              fontSize: 12,
              color: '#bbb',
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
              formatter: '{c}°',
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
            precision: 1,
            data: [
              {
                type: 'average',
                name: 'Avg',
              },
            ],
            label: {
              formatter: '{c}°',
              position: 'insideMiddleTop',
              fontSize: 12,
              color: '#bbb',
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
              formatter: '{c}°',
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
            precision: 1,
            animate: true,
            data: [
              {
                type: 'average',
                name: 'Avg',
              },
            ],
            label: {
              formatter: '{c}°',
              position: 'insideMiddleTop',
              fontSize: 12,
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

  private updateChartData() {
    if (this.dataPosition.length > 1000) {
      this.dataSignal.shift();
      this.dataPosition.shift();
      this.dataElevation.shift();
    }
    const date = new Date();
    this.dataSignal.push(this.fonctionSinusoidale(date, -36, 15));
    this.dataPosition.push(this.fonctionSinusoidale(date, 180, 6));
    this.dataElevation.push(this.fonctionSinusoidale(date, 45, 3));
  }
}
