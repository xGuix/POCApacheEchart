import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
})
export class ChartViewComponent implements AfterViewInit {
  @Input() chartId!: string;
  dataTempOne: any[] = [];
  dataTempTwo: any[] = [];
  dataTempThree: any[] = [];
  chart: any;

  isDarkMode = false;
  darkColor!: string;
  lightColor!: string;
  oneBlueColor: string = '#0b5eb4';
  twoOrangeColor: string = '#f2994a';
  threeDarkYellowColor: string = '#f8cd41';

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.chart = echarts.init(document.getElementById(this.chartId));

    // Component DOM element acces
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

  private fonctionSinusoidaleOne(
    date: Date,
    position: number,
    amplitude: number
  ) {
    const traceLine =
      position +
      amplitude *
        (2 * Math.sin(0.000009 * date.getTime()) +
          Math.cos(0.00003 * date.getTime()) +
          (Math.random() - 0.5) / 2);
    return [date, Math.round(traceLine * 10) / 10];
  }

  private fonctionSinusoidaleTwo(
    date: Date,
    position: number,
    amplitude: number
  ) {
    const traceLine =
      position +
      amplitude *
        (2 * Math.cos(0.000003 * date.getTime()) +
          Math.sin(0.00009 * date.getTime()) +
          (Math.random() - 0.5) / 2);
    return [date, Math.round(traceLine * 10) / 10];
  }

  private fonctionSinusoidaleThree(
    date: Date,
    position: number,
    amplitude: number
  ) {
    const traceLine =
      position +
      amplitude *
        (2 * Math.sin(0.000003 * date.getTime()) +
          Math.cos(0.00003 * date.getTime()) +
          (Math.random() - 0.5) / 2);
    return [date, Math.round(traceLine * 10) / 10];
  }

  private initializeChartData() {
    const currentTime = new Date();
    const oneMinuteEarlier = new Date(currentTime.getTime() - 1000000);
    for (let i = 0; i < 1000; i++) {
      const pastDate = new Date(oneMinuteEarlier.getTime() + i * 1000);
      this.dataTempOne.push(this.fonctionSinusoidaleOne(pastDate, 10, 1));
      this.dataTempTwo.push(this.fonctionSinusoidaleTwo(pastDate, 9, 1));
      this.dataTempThree.push(this.fonctionSinusoidaleThree(pastDate, 8, 1));
    }
  }

  private renderChart() {
    this.chart.setOption({
      color: [
        this.oneBlueColor,
        this.twoOrangeColor,
        this.threeDarkYellowColor,
      ],
      title: {
        text: 'TEMPERATURE AXIS',
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
            optionToContent: function (opt: any) {
              let axisData = opt.xAxis[0].data;
              let series = opt.series;
              let table =
                '<table style="width:60%;text-align:center"><tbody><tr>' +
                '<td>Time</td>' +
                '<td>' +
                series[0].name +
                '</td>' +
                '<td>' +
                series[1].name +
                '</td>' +
                '<td>' +
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
                  series[0].data[i] +
                  '</td>' +
                  '<td>' +
                  series[1].data[i] +
                  '</td>' +
                  '<td>' +
                  series[2].data[i] +
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
            title: 'Export Image',
          },
        },
        iconStyle: {
          borderColor: this.isDarkMode ? this.lightColor : this.darkColor,
        },
        top: 150,
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
            opacity: 0.6,
          },
        },
        axisTick: {
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
      yAxis: {
        name: 'TEMPERATURE',
        type: 'value',
        //boundaryGap: [0, 0],
        min: 5,
        max: 15,
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
            width: 1.5,
          },
          areaStyle: {
            opacity: 0.3,
          },
          smooth: false,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.dataTempOne,
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
            data: [{ type: 'average', name: 'Avg' }],
            label: {
              formatter: '{c}°',
              color: this.oneBlueColor,
              borderWidth: 0,
            },
          },
          //stack: 'temperature',
          tooltip: {
            show: true,
          },
        },
        {
          name: 'Fake Temperature 2',
          type: 'line',
          lineStyle: {
            width: 1.5,
          },
          areaStyle: {
            opacity: 0.3,
          },
          smooth: false,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.dataTempTwo,
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
            data: [{ type: 'average', name: 'Avg' }],
            label: {
              formatter: '{c}°',
              color: this.twoOrangeColor,
              borderWidth: 0,
            },
          },
          //stack: 'temperature',
          tooltip: {
            show: true,
          },
        },
        {
          name: 'Fake Temperature 3',
          type: 'line',
          lineStyle: {
            width: 1.5,
          },
          areaStyle: {
            opacity: 0.3,
          },
          smooth: false,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.dataTempThree,
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
            data: [{ type: 'average', name: 'Avg' }],
            label: {
              formatter: '{c}°',
              color: this.threeDarkYellowColor,
              borderWidth: 0,
            },
          },
          //stack: 'temperature',
          tooltip: {
            show: true,
          },
        },
      ],
    });
  }

  private updateChartData() {
    if (this.dataTempOne.length > 1000) {
      this.dataTempOne.shift();
      this.dataTempTwo.shift();
      this.dataTempThree.shift();
    }
    const dateNow = new Date();
    this.dataTempOne.push(this.fonctionSinusoidaleOne(dateNow, 10, 1));
    this.dataTempTwo.push(this.fonctionSinusoidaleTwo(dateNow, 9, 1));
    this.dataTempThree.push(this.fonctionSinusoidaleThree(dateNow, 8, 1));
  }
}
