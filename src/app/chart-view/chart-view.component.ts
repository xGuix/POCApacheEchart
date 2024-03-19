import { AfterViewInit, Component, Input } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrl: './chart-view.component.scss'
})
export class ChartViewComponent implements AfterViewInit {
  @Input() chartId!: string;
  data: any[] = [];

  constructor() {}

  ngAfterViewInit() {
    // Initialiser le graphique avec l'élément DOM
    const chart = echarts.init(document.getElementById(this.chartId));

    //Mettre 600 éléments initiale dans la liste
    const currentTime = new Date();
    const oneMinuteEarlier = new Date(currentTime.getTime() - 60000);
    for (let i = 0; i < 1000; i++) {
      const date = new Date(oneMinuteEarlier.getTime()+(i*60));
      this.data.push([
        date,
        Math.floor(Math.random() * 60) + 30
      ]);
    }

    // Afficher le graphique
    chart.setOption({
      title: {
        text: 'Data with Time Axis'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 100,
        splitLine: {
          show: true
        }
      },
      series: [{
        name: 'Fake Data',
        type: 'line',
        lineStyle: {
          width: 1,
        },
        smooth: true,
        animation: false,
        showSymbol: false,
        data: this.data,
      }]
    });

    // Mettre à jour les données toutes les dixiemes de secondes
    setInterval(() => {
      if(this.data.length > 1000){
        this.data.shift();
      }
      this.data.push(this.randomData());
      chart.setOption({
        series: [{
          data: this.data
        }]
      });
    }, 100);
  }

  randomData() {
    return [
      new Date(),
      Math.floor(Math.random() * 60) + 30
    ];
  }
}