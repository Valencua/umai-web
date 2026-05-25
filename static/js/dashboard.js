   // Bar Chart
    new ApexCharts(document.getElementById('barChart'), {
      chart: {
        type: 'bar',
        height: 180,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Reservas',
        data: [8, 14, 7, 16, 11, 18, 20]
      }],
        xaxis: {
        categories: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
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
      tooltip: { theme: 'dark' },
      theme: { mode: 'dark' }
    }).render();

    // Donut Chart
    new ApexCharts(document.getElementById('donutChart'), {
      chart: {
        type: 'donut',
        height: 140,
        width: 140,
        background: 'transparent',
        toolbar: { show: false },
        sparkline: { enabled: true }
      },
      series: [87, 23, 18],
      colors: ['#4CAF50', '#e53935', '#FF7A41'],
      dataLabels: { enabled: false },
      legend: { show: false },
      tooltip: { enabled: false },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: { size: '75%' }
        }
      },
      theme: { mode: 'dark' }
    }).render();