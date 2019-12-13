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

            expander: {
                tpl: [
                    '<div class="row mt-5 mb-5" id="flat-number-chart-{project_id}">',
                        '<div class="col" id="flat-number-chart-container-{project_id}" style="height: 200px;"></div>',
                        '<div class="col project-info-expander" style="height: 200px;">',
                            '<p><b>Последняя проверка:</b> {last_check_at}</p>',
                            '<p><b>Ссылка на проект:</b> <a href={url}>{name}</a></p>',
                        '</div>',
                    '</div>',
                    '<div class="row mt-5 mb-5" id="flat-avg-price-chart-{project_id}">',
                        '<div class="col" id="flat-avg-price-chart-container-{project_id}" style="height: 200px;"></div>',
                    '</div>',
                    '<div class="row mt-5" id="open-flat-page">',
                        '<div class="col-sm-12 text-center">',
                            '<a class="btn btn-secondary open-flat-page-btn"href="/projects/{project_id}">Посмотреть квартиры</a>',
                        '</div>',
                    '</div>',
                ].join(""),
                render: function(renderTo, data, columnsWidth){
                    $(".fancy-grid-expand-row").find(':hidden').remove()
                    $.getJSON( "/api/projects/"+ data.project_id +"/stats", function( d ) {
                        $('#flat-number-chart-' + data.project_id + ' .project-info-expander').append("<p><b>Количество студий:</b> "+ d['statistics']['0']['count'] +"</p>")
                        $('#flat-number-chart-' + data.project_id + ' .project-info-expander').append("<p><b>Количество 1 к.кв:</b> "+ d['statistics']['1']['count'] +"</p>")
                        $('#flat-number-chart-' + data.project_id + ' .project-info-expander').append("<p><b>Количество 2 к.кв:</b> "+ d['statistics']['2']['count'] +"</p>")
                        $('#flat-number-chart-' + data.project_id + ' .project-info-expander').append("<p><b>Количество 3 к.кв:</b> "+ d['statistics']['3']['count'] +"</p>")
                        $('#flat-number-chart-' + data.project_id + ' .project-info-expander').append("<p><b>Количество 4 к.кв:</b> "+ d['statistics']['4']['count'] +"</p>")
                        drawFlatsAvgPriceChart(data.project_id, d['statistics'])
                        console.log(data)
                    });
                    drawFlatNumberChart(data.project_id, data)
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

            expander: {
                tpl: [
                    '<div class="row mt-5 mb-5" id="flat-price-chart-{flat_id}">',
                        '<div class="col" id="flat-price-chart-container-{flat_id}" style="height: 200px; width: 100%;"></div>',
                        '<div class="col project-info-expander" style="height: 200px;">',
                            '<p><b>Проект:</b> {project_name}</p>',
                            '<p><b>Последняя проверка:</b> {last_check_at}</p>',
                            '<p><b>Адрес:</b> {address}</p>',
                            '<p><b>Блок:</b> {house}</p>',
                            '<p><b>Статус:</b> {last_status}</p>',
                            '<p><b>Этаж:</b> {floor}</p>',
                            '<p><b>Заселение:</b> {settlement_date}</p>',
                        '</div>',
                    '</div>'
                ].join(""),
                render: function(renderTo, data, columnsWidth){
                    $(".fancy-grid-expand-row").find(':hidden').remove()
                    console.log(data)
                    drawFlatPriceChart(data.flat_id, data)
                },
                dataFn: function(grid, data){
                    data.project_name = data.project.name
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