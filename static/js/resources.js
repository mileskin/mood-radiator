(function() {
  resources = {
    common: {
      js: [
        '/js/vendor/jquery-1.6.4.js',
        '/socket.io/socket.io.js',
        '/js/vendor/underscore-1.2.3-min.js',
        '/js/vendor/i-can-haz-0.9.min.js',
        '/js/team-radar.js',
        '/js/view.js'
      ],
      css: [
        '/css/app.css'
      ]
    },
    production: {
      js: [
        '/js/main.js'
      ]
    },
    test: {
      js: [
        '/spec/lib/jasmine/jasmine-1.1.0/jasmine.js',
        '/spec/lib/jasmine-jquery-1.3.1.js',
        '/spec/lib/jasmine/jasmine-1.1.0/jasmine-html.js',
        '/spec/lib/urlEncode.js',
        '/spec/lib/jasmine-fake-ajax-0.3.2.js',
        '/spec/spec-helper.js',
        '/spec/team-radar-spec.js',
        '/spec/runner.js'
      ],
      css: [
        '/spec/lib/jasmine/jasmine-1.1.0/jasmine.css'
      ]
    }
  }

  resources.common.js.forEach(addJs)
  resources.common.css.forEach(addCss)

  resources.test.js.forEach(addJs)
  resources.test.css.forEach(addCss)

  function addJs(path) {
    document.write('\n  <script type="text/javascript" src="' + path + '"></script>')
  }

  function addCss(path) {
    document.write('\n  <link rel="stylesheet" type="text/css" href="' + path + '"/>')
  }
})()

