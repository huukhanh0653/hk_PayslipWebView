const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Function to load and register.js custom helpers
function loadHelpers(helpersDir) {
    const helpers = require(helpersDir);
    Object.keys(helpers).forEach(order => {
        Handlebars.registerHelper(helpers[order].name, helpers[order]);
    });
}

// Function to load and register.js partials
function loadPartials(partialsDir) {
    fs.readdirSync(partialsDir).forEach(filename => {
        const partialName = path.basename(filename, '.hbs');
        const partialTemplate = fs.readFileSync(path.join(partialsDir, filename), 'utf8');
        Handlebars.registerPartial(partialName, partialTemplate);
    });
}

// Function to compile a Handlebars template with a layout
function compile(view, options) {
    const layoutPath = path.join(__dirname,'../views/layouts/', options.layout ? options.layout : 'login.hbs');
    const layoutSource = fs.readFileSync(layoutPath, 'utf8');
    const templatePath = path.join(__dirname,'../views/',view)
    const templateSource = fs.readFileSync(templatePath, 'utf8');

    const layout = Handlebars.compile(layoutSource);
    const template = Handlebars.compile(templateSource);

    const content = template(options);
    return layout({...options, body: content});
}

// Load helpers and partials
function initializeHandlebars() {
    const helpersDir = path.join(__dirname,'helpers.js');
    const partialsDir = path.join(__dirname,'../views/partials')

    loadHelpers(helpersDir);
    loadPartials(partialsDir);
}

module.exports = {
    Handlebars,
    initializeHandlebars,
    compile
};