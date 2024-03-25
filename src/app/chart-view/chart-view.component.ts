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
    return [date, Math.round(traceLine * 100) / 100];
  }

  private initializeChartData() {
    const currentTime = new Date();
    const oneMinuteEarlier = new Date(currentTime.getTime() - 60000);
    for (let i = 0; i < 1000; i++) {
      const pastDate = new Date(oneMinuteEarlier.getTime() + i * 60);
      this.dataTempOne.push(this.fonctionSinusoidale(pastDate, 0, 1));
      this.dataTempTwo.push(this.fonctionSinusoidale(pastDate, -10, 1));
      this.dataTempThree.push(this.fonctionSinusoidale(pastDate, +10, 1));
    }
  }

  private renderChart() {
    this.chart.setOption({
      color: ['#87f7cf', '#72ccff', ' #fc97af'],
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
          areaStyle: {
            opacity: 0.3,
          },
          smooth: true,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.dataTempOne,
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
          name: 'Fake Temperature 2',
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
          data: this.dataTempTwo,
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
          areaStyle: {
            opacity: 0.3,
          },
          smooth: true,
          animation: false,
          showSymbol: false,
          symbolSize: 6,
          data: this.dataTempThree,
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

  private updateChartData() {
    if (this.dataTempOne.length > 1000) {
      this.dataTempOne.shift();
      this.dataTempTwo.shift();
      this.dataTempThree.shift();
    }
    const dateNow = new Date();
    this.dataTempOne.push(this.fonctionSinusoidale(dateNow, 0, 1));
    this.dataTempTwo.push(this.fonctionSinusoidale(dateNow, -10, 1));
    this.dataTempThree.push(this.fonctionSinusoidale(dateNow, +10, 1));
  }
}
