import {
  AfterViewInit,
  Component,
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
  isDarkMode = false;
  chart: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isDarkMode'] && this.chart) {
      this.updateBackgroundColor();
    }
  }

  ngAfterViewInit() {
    this.chart = echarts.init(document.getElementById(this.chartId));

    // Initialiser les données du graphique
    this.initializeChartData();
    // Afficher le graphique
    this.renderChart();

    // Mettre à jour les données périodiquement
    setInterval(() => {
      this.updateChartData();
      this.renderChart();
    }, 100);
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
      this.data.push([date, Math.floor(Math.random() * 60) + 30]);
    }
  }

  private renderChart() {
    this.chart.setOption({
      title: {
        text: 'Data with Time Axis',
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
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 100,
        splitLine: {
          show: true,
        },
      },
      color: ['#f7f494'],
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          lineStyle: {
            width: 1,
          },
          smooth: true,
          animation: false,
          showSymbol: false,
          data: this.data,
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
    }
    this.data.push(this.randomData());
  }

  public updateBackgroundColor() {
    if (this.chart) {
      this.chart.setOption({
        backgroundColor: this.isDarkMode ? 'rgba(41,52,65,1)' : 'white',
      });
    }
  }
}
