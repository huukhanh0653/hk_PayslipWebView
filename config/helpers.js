const moment = require('moment');

function avoidEmpty(data) {
    if (data === undefined) return "-";
    let _data = String(Math.floor(data));
    _data = data.toLocaleString()
    return (_data.length === 0 ? "-" : _data);
}

function reformat(createdAt){
    return ' ' + moment(createdAt).format('MM/YYYY');
}

module.exports = [avoidEmpty, reformat]