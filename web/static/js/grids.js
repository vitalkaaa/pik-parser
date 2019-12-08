function drawProjectChart(xx, yy){
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

    for (var i=0; i<xx.length; i++) {
        dataPoints.push({
            x: new Date(Date.parse(xx[i])),
            y: yy[i]
        })
    }

    console.log(dataPoints)

    $("#flat-number-char-container").CanvasJSChart(options);
}



function drawFloatCostChart(xx, yy){
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

    for (var i=0; i<xx.length; i++) {
        dataPoints.push({
            x: new Date(Date.parse(xx[i])),
            y: yy[i]
        })
    }

    console.log(dataPoints)

    $("#flat-price-chart-container").CanvasJSChart(options);
}


function openProjectModal(projectData) {
    $("#project-link").prop("href", projectData.url)
    $("#project-link").text(projectData.name)
    $("#project-photo-modal").html("<img src='" + projectData.project_img + "'></img>")
    $("#flats-left").html("<b>Квартир в продаже:</b> " + projectData.last_flats)
    $("#last-check").html("<b>Последняя проверка:</b> " + projectData.last_check_at.split('T')[0])
    $("#open-flat-page-btn").prop("href", "/projects/" + projectData.project_id)

    $("#modal-window").modal({
      fadeDuration: 100,
      width: 600
    });

    $("#flat-price-chart").prop('hidden', true);

    drawProjectChart(projectData.dates, projectData.flats);

    $.getJSON( "/api/flats/" + projectData.project_id, function( flatsData ) {
        console.log( projectData );
        console.log( flatsData );
    });
}

function openFlatModal(floatData) {
    console.log(floatData)
    $("#project-link").prop("href", floatData.project.url)
    $("#project-link").text(floatData.project.name)
    $("#project-photo-modal").html("<img src='" + floatData.project.project_img + "'></img>")
    $("#flats-left").html("<b>Квартир в продаже:</b> " + floatData.project.last_flats)
    $("#last-check").html("<b>Последняя проверка:</b> " + floatData.project.last_check_at.split('T')[0])
    $("#open-flat-page-btn").prop("href", "/projects/" + floatData.project.project_id)

    $("#modal-window").modal({
      fadeDuration: 100,
      width: 600
    });

    $("#flat-number-chart").prop('hidden', true);
    $("#open-flat-page").prop('hidden', true);

    console.log(floatData.dates, floatData.prices)
    drawFloatCostChart(floatData.dates, floatData.prices);


}

function renderProjectsGrid(){
    document.addEventListener("DOMContentLoaded", function() {
        new FancyGrid({
            title: 'Проекты',
            renderTo: 'grid-container',
            width: 'fit',
            height: 'fit',
            trackOver: true,
            cellHeight: 75,
            columnLines: false,
            theme: 'gray',

            data: {
              proxy: {
                type: 'rest',
                url: '/api/projects'
              }
            },

            selModel: {
                type: 'row',
            },

            paging: {
                pageSize: 10,
                pageSizeData: [10, 20, 50, 100]
            },

//            events: [{
//                cellclick: function(grid, o){
//                    openProjectModal(o.data);
//                }
//            }],

            defaults: {
                type: 'string',
                sortable: true,
                editable: false,
                resizable: false,
                align: 'center',
                cellAlign: 'center'
            },



            columns: [{
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
            }, {
                index: 'last_flats',
                title: 'Количество квартир',
                type: 'number',
                flex: 1
            }, {
                index: 'flats',
                title: 'Количество квартир',
                type: 'sparklineline',
                flex: 1
            }, {
                index: 'last_check_at',
                title: 'Последнее обновление',
                flex: 1,
                type: 'date',
                sortable: false,
                format: {
                    read: 'Y-m-d',
                },
            }, {
                type: 'action',
                flex: 1,
                title: '',
                items: [{
                    text: 'Подробнее',
                    cls: 'btn  btn-success prj-info-btn',
                    handler: function(grid, o){
                        openProjectModal(o.data);
                    }
                }]
            }]
         });
    });
}

function renderFlatsGrid(project_id){
    document.addEventListener("DOMContentLoaded", function() {
        new FancyGrid({
            title: 'Квартиры',
            renderTo: 'grid-container',
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

            selModel: {
                type: 'row',
            },

            paging: {
                pageSize: 10,
                pageSizeData: [10, 20, 50, 100]
            },

//            events: [{
//                cellclick: function(grid, o){
//                    openFlatModal(o.data);
//                }
//            }],

            defaults: {
                type: 'string',
                sortable: true,
                editable: false,
                resizable: false,
                align: 'center',
                cellAlign: 'center'
            },


            columns: [{
                index: 'flat_plan_img',
                title: 'Фото',
                type: 'image',
                cls: 'photo',
                flex: 1,
            },{
                index: 'area',
                title: 'Площадь',
                type: 'number',
                flex: 1,
            }, {
                index: 'last_price',
                title: 'Цена',
                flex: 1,
                type: 'number',
                render: function(o){
                    o.value = o.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return o
                },
            }, {
                index: 'rooms',
                title: 'Количество комнат',
                flex: 1,
                type: 'number',
            }, {
                index: 'prices',
                title: 'Динамика цен',
                type: 'sparklineline',
                flex: 1,
            }, {
                index: 'last_check_at',
                title: 'Последнее обновление',
                flex: 1,
                type: 'date',
                sortable: false,
                format: {
                    read: 'Y-m-d',
                },
            }, {
                type: 'action',
                flex: 1,
                title: '45678',
                items: [{
                    text: 'Подробнее',
                    cls: 'btn  btn-success prj-info-btn',
                    handler: function(grid, o){
                        openFlatModal(o.data);
                    }
                }]
            }]
         });
    });
}