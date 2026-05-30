// Bar Chart — usa datos reales de la API
new ApexCharts(document.getElementById('barChart'), {
  chart: {
    type: 'bar',
    height: 180,
    toolbar: { show: false },
    background: 'transparent',
    events: {
      dataPointSelection: function() { return false; }
    }
  },
  series: [{
    name: 'Reservas',
    data: reservasSemana.map(function(d) { return d.reservas; })
  }],
  xaxis: {
    categories: reservasSemana.map(function(d) { return d.dia; }),
    labels: {
      style: {
        colors: ['#FFF5EA'],
        fontFamily: 'Sen',
        fontSize: '10px'
      },
      rotate: 0,
      hideOverlappingLabels: false,
      trim: false
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { show: false },
  grid: { show: false },
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: '55%' }
  },
  colors: ['#5B534E'],
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: function(val) { return val + ' reservas'; }
    }
  },
  states: {
    active: { filter: { type: 'none' } }
  },
  theme: { mode: 'dark' }
}).render();

// Donut Chart — usa datos reales de la API
new ApexCharts(document.getElementById('donutChart'), {
  chart: {
    type: 'donut',
    height: 140,
    width: 140,
    background: 'transparent',
    toolbar: { show: false },
    sparkline: { enabled: true }
  },
  series: [
    metricas.visitaron.cantidad,
    metricas.canceladas.cantidad,
    metricas.pendientes.cantidad
  ],
  colors: ['#4CAF50', '#e53935', '#FF7A41'],
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: { enabled: false },
  stroke: { width: 0 },
  plotOptions: {
    pie: { donut: { size: '75%' } }
  },
  theme: { mode: 'dark' }
}).render();