
function renderProjectInfo(projectData){
    console.log(projectData)
    $( "#test" ).text(projectData.name);
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
                url: 'api/projects'
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

            events: [{
                rowclick: function(grid, o){
                    renderProjectInfo(o.data)
                }
            }],


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