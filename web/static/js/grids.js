function drawProjectChart(id, data){
    var dataPoints = [];

    var options =  {
        animationEnabled: true,
        theme: "light2",
        height: 200,
        axisX: {
            valueFormatString: "DD MMM YYYY",
        },
        axisY: {
            title: "Количество квартир",
            titleFontSize: 14,
            gridColor: "gray",
            gridThickness: 0,
            includeZero: false
        },
        data: [{
            type: "line",
            yValueFormatString: "#,###",
            dataPoints: dataPoints
        }]
    };

    for (var i=0; i<data.dates.length; i++) {
        dataPoints.push({
            x: new Date(Date.parse(data.dates[i])),
            y: data.flats[i]
        })
    }

    $("#flat-number-chart-container-" + id).CanvasJSChart(options);
}

function drawFloatCostChart(id, data){
    var dataPoints = [];

    var options =  {
        animationEnabled: true,
        theme: "light2",
        height: 200,
        axisX: {
            valueFormatString: "DD MMM YYYY",
        },
        axisY: {
            title: "Цена квартиры",
            titleFontSize: 14,
            gridColor: "gray",
            gridThickness: 0,
            includeZero: false

        },
        data: [{
            type: "line",
            yValueFormatString: "Р#,###.##",
            dataPoints: dataPoints
        }]
    };

    for (var i=0; i<data.dates.length; i++) {
        dataPoints.push({
            x: new Date(Date.parse(data.dates[i])),
            y: data.prices[i]
        })
    }

    $("#flat-price-chart-container-" + id).CanvasJSChart(options);
}


function renderProjectsGrid(){
    document.addEventListener("DOMContentLoaded", function() {
        new FancyGrid({
            title: 'Проекты',
            renderTo: 'grid-container',
            textSelection: true,
            width: 'fit',
            height: 'fit',
            trackOver: false,
            nativeScroller: false,
            cellHeight: 75,
            columnLines: false,
            theme: 'gray',

            data: {
              proxy: {
                type: 'rest',
                url: '/api/projects'
              }
            },

            expander: {
                tpl: [
                    '<div class="row mt-5 mb-5" id="flat-number-chart-{project_id}">',
                        '<div class="col" id="flat-number-chart-container-{project_id}" style="height: 200px;"></div>',
                        '<div class="col" style="height: 200px;"></div>',
                    '</div>',
                    '<div class="row mt-5" id="open-flat-page">',
                        '<div class="col-sm-12 text-center">',
                            '<a class="btn btn-secondary open-flat-page-btn"href="/projects/{project_id}">',
                                'Посмотреть квартиры ',
                            '</a>',
                        '</div>',
                    '</div>',
                ].join(""),
                render: function(renderTo, data, columnsWidth){
                    $(".fancy-grid-expand-row").find(':hidden').remove()
                    drawProjectChart(data.project_id, data)
                },
                dataFn: function(grid, data){
                    return data
                },
            },

            events: [{
                cellclick: function(grid, o) {
                    console.log(o.data.expanded)
                    if (o.data.expanded != true) {
                        grid.expander.expand(o.infiniteRowIndex);
                        o.data.expanded = true
                    } else {
                        grid.expander.collapse(o.infiniteRowIndex);
                        o.data.expanded = false
                    }
                }
            }],

            paging: {
                pageSize: 20,
                pageSizeData: [10, 20, 50, 100]
            },

            defaults: {
                type: 'string',
                sortable: true,
                editable: false,
                resizable: false,
                align: 'center',
                cellAlign: 'center'
            },

            columns: [{
                type: 'expand',
                locked: true
            }, {
                index: 'project_img',
                title: 'Фото',
                type: 'image',
                cls: 'photo',
                flex: 1,
                width: 100,
            },{
                index: 'name',
                title: 'Название',
                flex: 1,
                filter: {
                    header: true,
                    emptyText: '',
                }
            }, {
                index: 'last_flats',
                title: 'Количество квартир',
                type: 'number',
                flex: 1,
                filter: {
                    header: true,
                    emptyText: '',
                    tip: [
                        'Равно: =30',
                        'Больше: >30',
                        'Меньше: <30',
                    ].join(" | ")
                }
            }, {
                index: 'flats',
                title: 'Количество квартир',
                type: 'sparklineline',
                flex: 1
            }]
         });
    });
}

function renderFlatsGrid(project_id){
    document.addEventListener("DOMContentLoaded", function() {
        new FancyGrid({
            title: 'Квартиры',
            renderTo: 'grid-container',
            textSelection: false,
            nativeScroller: true,
            width: 'fit',
            height: 'fit',
            trackOver: true,
            cellHeight: 75,
            columnLines: false,
            theme: 'gray',

            data: {
                proxy: {
                  type: 'rest',
                  url: '/api/flats/' + project_id
                }
            },

            expander: {
                tpl: [
                    '<div class="row mt-5 mb-5" id="flat-price-chart-{flat_id}">',
                    '<div class="col" id="flat-price-chart-container-{flat_id}" style="height: 200px; width: 100%;"></div>',
                   '<div class="col" style="height: 200px;"></div>',
                    '</div>'
                ].join(""),
                render: function(renderTo, data, columnsWidth){
                    $(".fancy-grid-expand-row").find(':hidden').remove()
                    drawFloatCostChart(data.flat_id, data)
                }
            },

            events: [{
                cellclick: function(grid, o) {
                    console.log(o.data.expanded)
                    if (o.data.expanded != true) {
                        grid.expander.expand(o.infiniteRowIndex);
                        o.data.expanded = true
                    } else {
                        grid.expander.collapse(o.infiniteRowIndex);
                        o.data.expanded = false
                    }
                }
            }],

            paging: {
                pageSize: 20,
                pageSizeData: [10, 20, 50, 100]
            },

            defaults: {
                type: 'string',
                sortable: true,
                editable: false,
                resizable: false,
                align: 'center',
                cellAlign: 'center'
            },


            columns: [{
                type: 'expand',
                locked: true
            },{
                index: 'flat_plan_img',
                title: 'Фото',
                type: 'image',
                cls: 'photo',
                flex: 1,
            },{
                title: 'Дом',
                flex: 1,
                type: 'string',
                sortable: false,
                render: function(o){
                    o.value = o.value.house
                    return o
                },
            },{
                index: 'area',
                title: 'Площадь',
                type: 'number',
                flex: 1,
                filter: {
                    header: true,
                    emptyText: '',
                    tip: [
                        'Равно: =30',
                        'Больше: >30',
                        'Меньше: <30',
                    ].join(" | ")
                }
            },{
                index: 'last_price_per_m',
                title: 'Цена за м²',
                type: 'number',
                flex: 1,
                render: function(o){
                    o.value = Math.floor(o.value)
                    o.value = o.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    return o
                },
                filter: {
                    header: true,
                    emptyText: '',
                    tip: [
                        'Равно: =100000',
                        'Больше: >100000',
                        'Меньше: <100000',
                    ].join(" | ")
                }
            }, {
                index: 'last_price',
                title: 'Цена',
                flex: 1,
                type: 'number',
                render: function(o){
                    o.value = o.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    return o
                },
                filter: {
                    header: true,
                    emptyText: '',
                    tip: [
                        'Равно: =1000000',
                        'Больше: >1000000',
                        'Меньше: <1000000',
                    ].join(" | ")
                }
            }, {
                index: 'rooms',
                title: 'Количество комнат',
                flex: 1,
                type: 'number',
                filter: {
                    header: true,
                    emptyText: '',
                    tip: [
                        'Равно: =2',
                        'Больше: >2',
                        'Меньше: <2',
                    ].join(" | ")
                }
            }, {
                index: 'prices',
                title: 'Динамика цен',
                type: 'sparklineline',
                flex: 1,
            }]
         });
    });
}