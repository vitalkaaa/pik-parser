function drawFlatNumberChart(data){
    var dataPoints = [];

    for (var i=0; i<data.dates.length; i++) {
        dataPoints.push({
            x: new Date(Date.parse(data.dates[i])),
            y: data.flats[i]
        })
    }

  var chart = new CanvasJS.Chart("flat-number-chart-container", {
      animationEnabled: true,
        theme: "light2",

        title: {
            text: "Количество квартир",
            fontSize: 20
        },

        axisX: {
            valueFormatString: "DD/MM/YYYY",
            intervalType: "day",
            interval: 1,
            labelFontSize: 20,
        },
        axisY: {
            titleFontSize: 20,
            gridColor: "gray",
            gridThickness: 0,
            labelFontSize: 20,
            includeZero: false
        },
        data: [{
            markerSize: 5,
            type: "splineArea",
            yValueFormatString: "#,###",
            dataPoints: dataPoints
        }]
    });


//    $('#exampleModal').on('shown.bs.modal', function () {
//      chart.render();
//    });

    chart.render();
}



function drawFlatsAvgPriceChart(data){
    var dataPoints0 = [];
    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];
    var dataPoints4 = [];

    for (var i=0; i<data['0'].dates.length; i++) {
        dataPoints0.push({
            x: new Date(Date.parse(data['0'].dates[i])),
            y: data['0'].price[i]
        })
    }

    for (var i=0; i<data['1'].dates.length; i++) {
        dataPoints1.push({
            x: new Date(Date.parse(data['1'].dates[i])),
            y: data['1'].price[i]
        })
    }

    for (var i=0; i<data['2'].dates.length; i++) {
        dataPoints2.push({
            x: new Date(Date.parse(data['2'].dates[i])),
            y: data['2'].price[i]
        })
    }

    for (var i=0; i<data['3'].dates.length; i++) {
        dataPoints3.push({
            x: new Date(Date.parse(data['3'].dates[i])),
            y: data['3'].price[i]
        })
    }

    for (var i=0; i<data['4'].dates.length; i++) {
        dataPoints4.push({
            x: new Date(Date.parse(data['4'].dates[i])),
            y: data['4'].price[i]
        })
    }

    var chart = new CanvasJS.Chart("flat-avg-price-chart-container", {
        animationEnabled: true,
        theme: "light2",

        legend: {
            fontSize: 20
        },

        title: {
            text: "Средняя стоимость квартир за м²",
            fontSize: 20
        },

        axisX: {
            valueFormatString: "DD/MM/YYYY",
            labelFontSize: 20,
            intervalType: "day",
            interval: 1,
        },
        axisY: {
            titleFontSize: 20,
            labelFontSize: 20,
            gridColor: "gray",
            gridThickness: 0,
            includeZero: false
        },
        data: [{
            markerSize: 5,
            type: "spline",
            yValueFormatString: "#,###",
            name: "Студии",
            showInLegend: true,
            dataPoints: dataPoints0
        }, {
            markerSize: 5,
            type: "spline",
            name: "1 к.кв.",
            showInLegend: true,
            yValueFormatString: "#,###",
            dataPoints: dataPoints1
        }, {
            markerSize: 5,
            type: "spline",
            name: "2 к.кв.",
            showInLegend: true,
            yValueFormatString: "#,###",
            dataPoints: dataPoints2
        }, {
            markerSize: 5,
            type: "spline",
            name: "3 к.кв.",
            showInLegend: true,
            yValueFormatString: "#,###",
            dataPoints: dataPoints3
        }, {
            markerSize: 5,
            type: "spline",
            name: "4 к.кв.",
            showInLegend: true,
            yValueFormatString: "#,###",
            dataPoints: dataPoints4
        }]
    });

//    $('#exampleModal').on('shown.bs.modal', function () {
//      chart.render();
//    });
    chart.render();
}

function drawFlatPriceChart(data){
    console.log(data)
    var dataPoints = [];

    for (var i=0; i<data.dates.length; i++) {
        dataPoints.push({
            x: new Date(Date.parse(data.dates[i])),
            y: data.prices[i]
        })
    }

    var chart = new CanvasJS.Chart("flat-price-chart-container", {
        animationEnabled: true,
        theme: "light2",

        title: {
            text: "Цена квартиры",
            fontSize: 20
        },

        axisX: {
            valueFormatString: "DD/MM/YYYY",
            labelFontSize: 20,
            intervalType: "day",
            interval: 1,
        },
        axisY: {
            titleFontSize: 20,
            labelFontSize: 20,
            gridColor: "gray",
            gridThickness: 0,
            includeZero: false

        },
        data: [{
            markerSize: 5,
            type: "splineArea",
            yValueFormatString: "Р#,###.##",
            dataPoints: dataPoints
        }]
    });

    $('#exampleModal').on('shown.bs.modal', function () {
      chart.render();
    });}