'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var FrontenderGenerator = module.exports = function FrontenderGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.appname = path.basename(process.cwd());

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(FrontenderGenerator, yeoman.generators.Base);

FrontenderGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'list',
    name: 'framework',
    message: 'Какой фреймворк будем использовать?',
    choices: [{
        name: 'Foundation 5',
        value: 'foundation'
      }, {
        name: 'Twitter Bootstrap 3',
        value: 'bootstrap'
    }],
    default: 0
  }, {
    type: 'confirm',
    name: 'sass',
    message: 'Будем использовать Sass?',
    default: true
  }, {
    type: 'checkbox',
    name: 'features',
    message: 'Выбери дополнительные компоненты:',
    choices: [{
      name: 'Modernizr',
      value: 'modernizr',
      checked: true
    }, {
      name: 'Autoprefixer',
      value: 'autoprefixer',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {

    function hasFeature(feat) { return props.features.indexOf(feat) !== -1; }

    this.framework = props.framework;
    this.sass = props.sass;
    this.sass = props.sass;
    this.modernizr = hasFeature('modernizr');
    this.autoprefixer = hasFeature('autoprefixer');

    cb();
  }.bind(this));
};


FrontenderGenerator.prototype.git = function git() {
  console.log("git");
  this.copy('gitignore', '.gitignore');
};

FrontenderGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
};
FrontenderGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
}
FrontenderGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js', 'Gruntfile.js');
}

FrontenderGenerator.prototype.bower = function bower() {
  this.template('_bower.json', 'bower.json');
  this.copy('bowerrc', '.bowerrc');
}

FrontenderGenerator.prototype.readIndex = function readIndex() {
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.indexFile = this.engine(this.indexFile, this);
}

FrontenderGenerator.prototype.writeIndex = function writeIndex() {
  var fndir = 'bower_components/foundation/js/foundation/';
  var twbsdir = 'bower_components/sass-bootstrap/js/';
  if (this.framework == 'foundation') {
    this.indexFile = this.appendScripts(this.indexFile, 'js/foundation.js', [
      fndir + "foundation.js",
      fndir + "foundation.abide.js",
      fndir + "foundation.accordion.js",
      fndir + "foundation.alert.js",
      fndir + "foundation.clearing.js",
      fndir + "foundation.dropdown.js",
      fndir + "foundation.interchange.js",
      fndir + "foundation.joyride.js",
      fndir + "foundation.magellan.js",
      fndir + "foundation.offcanvas.js",
      fndir + "foundation.orbit.js",
      fndir + "foundation.reveal.js",
      fndir + "foundation.tab.js",
      fndir + "foundation.tooltip.js",
      fndir + "foundation.topbar.js"
      ]);
  } else if (this.framework == 'bootstrap') {
    this.indexFile = this.appendScripts(this.indexFile, 'js/bootstrap.min.js', [
        twbsdir + "affix.js",
        twbsdir + "alert.js",
        twbsdir + "dropdown.js",
        twbsdir + "tooltip.js",
        twbsdir + "modal.js",
        twbsdir + "transition.js",
        twbsdir + "button.js",
        twbsdir + "popover.js",
        twbsdir + "carousel.js",
        twbsdir + "scrollspy.js",
        twbsdir + "collapse.js",
        twbsdir + "tab.js"
      ]);
  }
};

FrontenderGenerator.prototype.stylesheets = function stylesheets() {
  if (this.framework == 'bootstrap' && this.sass) {
    this.template('bootstrap.scss', 'app/scss/main.scss');
  } else if (this.framework == 'foundation' && this.sass) {
    this.copy('foundation.scss', 'app/scss/main.scss');
  }
};

FrontenderGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/css');
  this.mkdir('app/fonts');
  this.mkdir('app/img');
  this.mkdir('app/js');
  if (this.sass) {
    this.mkdir('app/scss');
  }
  this.write('app/index.html', this.indexFile);

  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy('404.html', 'app/404.html');
  this.copy('robots.txt', 'app/robots.txt');
  this.copy('htaccess', 'app/.htaccess');
};
