import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-testing-view',
  templateUrl: './chart-double-view.component.html',
  styleUrls: ['./chart-double-view.component.scss'],
})
export class ChartTestingViewComponent implements AfterViewInit {
  @Input() chartId!: string;
  dataSignal: any[] = [];
  dataAzimut: any[] = [];
  dataElevation: any[] = [];
  chart: any;

  isDarkMode = false;
  darkColor!: string;
  lightColor!: string;
  oneBlueColor: string = '#0b5eb4';
  twoOrangeColor: string = '#f2994a';
  threeDarkYellowColor: string = '#f8cd41';
  fourYellowColor: string = '#f7f494';

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
    }, 1000);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  private fonctionSinusoidale(date: Date, position: number, amplitude: number) {
    const traceLine =
      position +
      amplitude *
        (2 * Math.sin(0.000006 * date.getTime()) +
          Math.cos(0.00003 * date.getTime()) +
          (Math.random() - 0.5) / 2);
    const value = Math.round(traceLine * 10) / 10;
    return [date, value];
  }

  private fonctionSinusoidaleWithMinMax(
    date: Date,
    position: number,
    amplitude: number
  ) {
    const traceLine =
      position +
      amplitude *
        (2 * Math.sin(0.0006 * date.getTime()) +
          Math.cos(0.0008 * date.getTime()) +
          (Math.random() - 0.5) / 2);
    const value = Math.round(traceLine * 10) / 10;
    const randomized = Math.random() * 10;
    const rand = Math.random();
    let min = value;
    let max = value;
    if (rand < 0.05) {
      min = value - randomized;
    }
    if (rand > 0.95) {
      max = value + randomized;
    }
    return [date, value, min, max];
  }

  private initializeChartData() {
    const currentTime = new Date();
    const oneMinuteEarlier = new Date(currentTime.getTime() - 1000000);
    for (let i = 0; i < 1000; i++) {
      const pastDate = new Date(oneMinuteEarlier.getTime() + i * 1000);
      this.dataSignal.push(this.fonctionSinusoidale(pastDate, -30, 12));
      this.dataAzimut.push(this.fonctionSinusoidale(pastDate, 180, 6));
      this.dataElevation.push(
        this.fonctionSinusoidaleWithMinMax(pastDate, 45, 3)
      );
    }
  }

  private renderChart() {
    this.chart.setOption({
      color: [
        this.oneBlueColor,
        this.twoOrangeColor,
        this.threeDarkYellowColor,
        this.fourYellowColor,
      ],
      backgroundColor: this.isDarkMode ? this.darkColor : this.lightColor,
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
            title: 'Double Chart Data View',
            optionToContent: function (opt: any) {
              let axisData = opt.xAxis[0].data;
              let series = opt.series;
              let table =
                '<table style="width:90%; text-align:center;"><tbody><tr>' +
                '<td><b>Time</td>' +
                '<td><b>' +
                series[0].name +
                '</td>' +
                '<td><b>' +
                series[1].name +
                '</td>' +
                '<td><b>' +
                series[2].name +
                '</td>' +
                '</tr>';
              for (var i = 0, l = axisData.length; i < l; i++) {
                let firstDate = new Date(axisData[i]);
                let formattedTime = firstDate.toLocaleTimeString();
                table +=
                  '<tr>' +
                  '<td>' +
                  formattedTime +
                  '</td>' +
                  '<td>' +
                  series[0].data[i][1] +
                  '</td>' +
                  '<td>' +
                  series[1].data[i][1] +
                  '</td>' +
                  '<td>' +
                  series[2].data[i][1] +
                  '</td>' +
                  '</tr>';
              }
              table += '</tbody></table>';
              return table;
            },
            lang: ['Data View', 'Close', 'Refresh'],
          },
          restore: {},
          saveAsImage: {
            show: true,
            title: "Export l'image",
            backgroundColor: this.isDarkMode ? this.darkColor : this.lightColor,
          },
        },
        iconStyle: {
          borderColor: this.isDarkMode ? this.lightColor : this.darkColor,
        },
        top: 150,
      },
      xAxis: {
        type: 'time',
        data: this.dataElevation.map((item) => item[0]),
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
          boundaryGap: [0, 0],
          //min: 0,
          //max: 360,
          scale: true,
          interval: 120,
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
      visualMap: {
        orient: 'horizontal',
        bottom: 9,
        left: 240,
        seriesIndex: 0,
        pieces: [
          {
            gt: 0,
            lte: 20,
            color: '#93CE07',
          },
          {
            lte: 0,
            gt: -15,
            color: '#FBDB0F',
          },
          {
            lte: -15,
            gt: -30,
            color: '#FC7D02',
          },
          {
            lte: -30,
            gt: -50,
            color: '#FD0100',
          },
          {
            lte: -50,
            gt: -70,
            color: '#AA069F',
          },
          {
            lte: -70,
            color: '#AC3B2A',
          },
        ],
        outOfRange: {
          color: '#999',
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
          name: 'Fake signal',
          type: 'line',
          lineStyle: {
            width: 1.5,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(55, 162, 255)',
              },
              {
                offset: 1,
                color: 'rgb(116, 21, 219)',
              },
            ]),
            opacity: 0.3,
          },
          smooth: true,
          animation: true,
          showSymbol: true,
          symbolSize: 6,
          data: this.dataSignal,
          markPoint: {
            symbolSize: 60,
            label: {
              formatter: function (params: any) {
                return Math.round(params.value) + ' db';
              },
              fontWeight: '600',
              fontSize: 9.3,
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
                name: 'SignalNow',
                yAxis: this.dataSignal[this.dataSignal.length - 1][1],
              },
            ],
            symbol: ['none', 'arrow'],
            symbolOffset: [0, [2, 0]],
            symbolSize: 15,
            symbolRotate: 90,
            lineStyle: {
              width: 0,
            },
            label: {
              fontSize: 12,
              fontWeight: 'bold',
              padding: [0, 0, 3, 9],
              formatter: '{c} db',
              color: this.oneBlueColor,
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
            width: 1.5,
          },
          smooth: true,
          animation: true,
          showSymbol: true,
          symbolSize: 6,
          data: this.dataAzimut,
          markPoint: {
            symbolSize: 48,
            label: {
              formatter: '{c}°',
              fontWeight: '600',
              fontSize: 9,
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
                name: 'AzimutNow',
                yAxis: this.dataAzimut[this.dataAzimut.length - 1][1],
              },
            ],
            symbol: ['none', 'arrow'],
            symbolOffset: [0, [2, 0]],
            symbolSize: 15,
            symbolRotate: 90,
            lineStyle: {
              width: 0,
            },
            label: {
              fontSize: 12,
              fontWeight: 'bold',
              padding: [0, 0, 6, 13],
              formatter: '{c}°',
              color: this.twoOrangeColor,
              borderWidth: 0,
            },
          },
          markArea: {
            silent: true,
            itemStyle: {
              opacity: 0.9,
            },
            data: [
              [
                {
                  yAxis: '160',
                },
                {
                  yAxis: '200',
                },
              ],
            ],
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
            width: 1.5,
          },
          smooth: true,
          animation: true,
          showSymbol: true,
          symbolSize: 6,
          data: this.dataElevation,
          markPoint: {
            symbolSize: 48,
            label: {
              formatter: '{c}°',
              fontWeight: '600',
              fontSize: 9,
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
                name: 'ElevationNow',
                yAxis: this.dataElevation[this.dataElevation.length - 1][1],
              },
            ],
            symbol: ['none', 'arrow'],
            symbolOffset: [0, [2, 0]],
            symbolSize: 15,
            symbolRotate: 90,
            lineStyle: {
              width: 0,
            },
            label: {
              fontSize: 12,
              fontWeight: 'bold',
              padding: [0, 0, 6, 13],
              formatter: '{c}°',
              color: this.threeDarkYellowColor,
              borderWidth: 0,
            },
          },
          markArea: {
            silent: true,
            itemStyle: {
              opacity: 0.9,
            },
            data: [
              [
                {
                  yAxis: '25',
                },
                {
                  yAxis: '65',
                },
              ],
            ],
          },
          tooltip: {
            show: true,
          },
        },
        {
          name: 'min',
          type: 'line',
          lineStyle: {
            color: this.threeDarkYellowColor,
            width: 0.72,
          },
          itemStyle: {
            color: this.fourYellowColor,
          },
          symbol: 'triangle',
          symbolSize: 9,
          yAxisIndex: 1,
          data: this.dataElevation.map((items) => [items[0], items[2]]),
          smooth: true,
          animation: true,
          showSymbol: true,
          tooltip: {
            show: true,
          },
        },
        {
          name: 'max',
          type: 'line',
          lineStyle: {
            color: this.threeDarkYellowColor,
            width: 0.72,
          },
          itemStyle: {
            color: this.fourYellowColor,
          },
          symbol: 'triangle',
          symbolRotate: 180,
          symbolSize: 9,
          yAxisIndex: 1,
          data: this.dataElevation.map((items) => [items[0], items[3]]),
          smooth: false,
          animation: false,
          showSymbol: false,
          tooltip: {
            show: true,
          },
        },
      ],
    });
  }

  private updateChartData() {
    if (this.dataAzimut.length > 1000) {
      this.dataSignal.shift();
      this.dataAzimut.shift();
      this.dataElevation.shift();
    }
    const date = new Date();
    this.dataSignal.push(this.fonctionSinusoidale(date, -36, 15));
    this.dataAzimut.push(this.fonctionSinusoidale(date, 180, 6));
    this.dataElevation.push(this.fonctionSinusoidaleWithMinMax(date, 45, 3));
  }
}
