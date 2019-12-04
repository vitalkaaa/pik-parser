function openProjectsModal(projectData) {
    $.getJSON( "/api/flats/" + projectData.project_id, function( flatsData ) {
        console.log( projectData );
        console.log( flatsData );

        $("#project-info").append("Ссылка на проект: <a href=" + projectData.url + ">" + projectData.name + "</a><br>");
        $("#project-info").append("Осталось квартир:" + projectData.last_flats + "<br>");
        $("#project-info").append("Последняя проверка:" + projectData.last_check_at + "<br>");
    });

    $("#project-info").modal({
      fadeDuration: 100
    });
}

function renderProjectsGrid(){
    document.addEventListener("DOMContentLoaded", function() {
        new FancyGrid({
            title: 'Проекты',
            renderTo: 'container',
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

            events: [{
                cellclick: function(grid, o){
                    openProjectsModal(o.data);
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
                flex: 1,
                width: 100,
            },{
                index: 'name',
                title: 'Название',
                flex: 1,
            }, {
                index: 'last_flats',
                title: 'Количество квартир',
                width: 150,
                type: 'number',
            }, {
                index: 'flats',
                title: 'Количество квартир',
                type: 'sparklineline',
                width: 150,
            }, {
                index: 'last_check_at',
                title: 'Последнее обновление',
                flex: 1,
                type: 'date',
                sortable: false,
                format: {
                    read: 'Y-m-d',
                },
            }]
         });
    });
}

function renderFlatsGrid(project_id){
    document.addEventListener("DOMContentLoaded", function() {
        new FancyGrid({
            title: 'Квартиры',
            renderTo: 'container',
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

            events: [],

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
                width: 100,
            },{
                index: 'area',
                title: 'Площадь',
                type: 'number',
                flex: 1,
            }, {
                index: 'last_price',
                title: 'Цена',
                width: 150,
                type: 'number',
            }, {
                index: 'rooms',
                title: 'Количество комнат',
                width: 150,
                type: 'number',
            }, {
                index: 'prices',
                title: 'Динамика цен',
                type: 'sparklineline',
                width: 150,
            }, {
                index: 'last_check_at',
                title: 'Последнее обновление',
                flex: 1,
                type: 'date',
                sortable: false,
                format: {
                    read: 'Y-m-d',
                },
            }]
         });
    });
}