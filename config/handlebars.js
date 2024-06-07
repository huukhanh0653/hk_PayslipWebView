const handlebars = require('express-handlebars');

function _avoidEmpty(data) {
    if (data === undefined) return "-";
    let _data = String(data);
    _data = data.toLocaleString()
    return (_data.length === 0 ? "-" : _data);
}

module.exports = handlebars.create(
    {
        extname: '.hbs',
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/layouts',
        partialsDir: 'views/partials',
        helpers: {
            avoidEmpty: (data) => {
                return _avoidEmpty(data)
            },

            reformat: (createAt) =>{
                return createAt;
            }
        }
    }
);
