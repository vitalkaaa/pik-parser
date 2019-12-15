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
            cellHeight: 100,
            columnLines: false,
            theme: 'gray',

            data: {
              proxy: {
                type: 'rest',
                url: '/api/projects'
              }
            },


            events: [{
                cellclick: function(grid, o) {
                    if (o.columnIndex != 4) {
                        $('#exampleModalLabel').text(o.data.name)
                        $('#open-flats-btn').prop('href', '/projects/' + o.data.project_id)
                        $('.modal-body').empty();
                        $('.modal-body').append('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
                        $('#exampleModal').modal()

                        $.getJSON( "/api/projects/"+ o.data.project_id +"/stats", function( d ) {
                            $('.modal-body').empty();
                            $('.modal-body').append(
                                ['<div class="row mt-2 mb-4" id="project-info-row" style="max-height:250px;">',
                                    '<div class="col-5 project-photo-container">',
                                        '<img src="'+ o.data.project_img +'"></img>',
                                    '</div>',
                                    '<div class="col-1"></div>',
                                    '<div class="col-6 project-info-row-container">',
                                        '<p><b>Последняя проверка:</b> '+o.data.last_check_at+'</p>',
                                        '<p><b>Ссылка на проект:</b> <a href='+o.data.url+'>'+o.data.name+'</a></p>',
                                    '</div>',
                                '</div><hr>',
                                '<div class="row mt-2 mb-4" id="flat-number-chart" style="height:200px;width:100%;">',
                                    '<div class="col" id="flat-number-chart-container" style="height:200px;width:100%;"></div>',
                                '</div><hr>',
                                '<div class="row mt-2 mb-4" id="flat-avg-price-chart" style="height:250px;width:100%;">',
                                    '<div class="col" id="flat-avg-price-chart-container" style="height:250px;width:100%;"></div>',
                                '</div>',
                                ].join('')
                            )

                            $('#project-info-row .project-info-row-container').append("<p><b>Количество студий:</b> "+ d['statistics']['0']['count'] +"</p>")
                            $('#project-info-row .project-info-row-container').append("<p><b>Количество 1 к.кв:</b> "+ d['statistics']['1']['count'] +"</p>")
                            $('#project-info-row .project-info-row-container').append("<p><b>Количество 2 к.кв:</b> "+ d['statistics']['2']['count'] +"</p>")
                            $('#project-info-row .project-info-row-container').append("<p><b>Количество 3 к.кв:</b> "+ d['statistics']['3']['count'] +"</p>")
                            $('#project-info-row .project-info-row-container').append("<p><b>Количество 4 к.кв:</b> "+ d['statistics']['4']['count'] +"</p>")


                            drawFlatsAvgPriceChart(d['statistics'])
                            drawFlatNumberChart(o.data)
                        });
                    }
                }
            }],


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
                width: 110,
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
            }, {
                width: 130,
                render: function(o){
                    url = '/projects/' + o.data.project_id

                    o.value = '<a class="btn btn-success grid-btn" href="'+url+'">Квартиры</a>';
                    return o
                }
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
            cellHeight: 100,
            columnLines: false,
            theme: 'gray',

            data: {
                proxy: {
                  type: 'rest',
                  url: '/api/projects/' + project_id
                }
            },


            events: [{
                cellclick: function(grid, o) {
                    $('#exampleModalLabel').text(o.data.project.name)
                    $('.modal-body').empty();

                    $('#open-flats-btn').prop('hidden', true)

                    $('.modal-body').append([
                        '<div class="row mt-2 mb-4" id="project-info-row" style="max-height:250px;">',
                            '<div class="col-5 project-photo-container">',
                                '<img src="'+ o.data.flat_plan_img +'"></img>',
                            '</div>',
                            '<div class="col-1"></div>',
                            '<div class="col-6 project-info-row-container">',
                                    '<p><b>Проект:</b> '+o.data.project.name+'</p>',
                                '<p><b>Последняя проверка:</b> '+o.data.last_check_at+'</p>',
                                '<p><b>Адрес:</b> '+o.data.address+'</p>',
                                '<p><b>Блок:</b> '+o.data.house+'</p>',
                                '<p><b>Статус:</b> '+o.data.last_status+'</p>',
                                '<p><b>Этаж:</b> '+o.data.floor+'</p>',
                                '<p><b>Заселение:</b> '+ o.data.settlement_date +'</p>',
                            '</div>',
                        '</div><hr>',
                        '<div class="row mt-2 mb-4" id="flat-price-chart" style="height:250px;width:100%;">',
                            '<div class="col" id="flat-price-chart-container" style="height:250px;width:100%;"></div>',
                        '</div>',
                        ].join(''));

                    $('#exampleModal').modal();
                    drawFlatPriceChart(o.data);
                }
            }],


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
                width: 100
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
                width: 90,
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
                title: 'Комнат',
                flex: 1,
                width: 80,
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