/**
 * Generic template for an Analiz module
 * @type {Object}
 */
module.exports = {

  /**
   * Configuration of the module
   * @type {Object}
   */
  config: {

    /**
     * Name of the plugin
     * @type {Object}
     */
    name: {
      'en': 'Stylestats',
      'fr': 'Stylestats'
    },


    /**
     * The plugin category (choose one in the documentation)
     * @type {String}
     */
    category: 'css',


    /**
     * List of the files the module will analize
     * @type {Array}
     */
    fileTypes: [
      '.css'
    ],


    /**
     * Render type
     * @type {String}
     */
    renderType: 'raw',


    /**
     * Options of the plugin
     * Array of option Object
     */
    options: [{
      label: {
        en: 'Media Queries',
        fr: 'Media Queries'
      },
      name: 'mediaQueries',
      type: 'boolean',
      data: true
    }, {
      label: {
        en: '!important declarations',
        fr: 'Déclarations !important'
      },
      name: 'importantDeclarations',
      type: 'boolean',
      data: false
    }, {
      label: {
        en: 'Specificity Graph',
        fr: 'Graphique de spécificités'
      },
      name: 'specificityGraph',
      type: 'boolean',
      data: false
    }, {
      label: {
        en: 'About the specificity Graph',
        fr: 'A propos du Graphique de spécificités'
      },
      name: 'SpecificityGraphDoc',
      type: 'documentation-link',
      data: 'http://csswizardry.com/2014/10/the-specificity-graph/'
    }, {
      label: {
        en: 'Property resets',
        fr: 'Réinitialisations de propriété'
      },
      name: 'propertyResets',
      type: 'boolean',
      data: false
    }, {
      label: {
        en: 'Vendor prefixed properties',
        fr: 'Préfixes vendeurs'
      },
      name: 'vendorPrefixedProperties',
      type: 'boolean',
      data: false
    }]
  },


  /**
   * Analize asynchronously the files send by Analiz and return the results to callback
   * @param  {Array} files          An array of the files send by Analiz
   * @param  {Object} options       Options chosen by the user
   * @param  {Function} callback    Callback to call after analyzing each file
   */
  run: function ( files, options, callback ) {
    // TODO : Find a better way to generate content
    var fs = require('fs');
    var cssstats = require('cssstats');

    files.forEach(function( file ) {
      fs.readFile( file, { encoding: 'utf-8' }, function ( err, content ) {
        if ( err ) {
          callback( {
            title: 'ERROR while reading files in ' + module.exports.config.name[ options.language ],
            content: err
          }, null );
        }

        var stats = cssstats(content, options);

        var html, tmp, i;

        html = '<style>' +
          'section>h1 { ' +
            'font-size: 24px;' +
            'border-bottom: 1px solid;' +
            'padding-bottom: 0.5em;' +
            'margin-top: 30px;'+
          '}' +
        '</style>';

        // Section summary
        html += '<section class="pure-g">';
        html += '<div class="pure-u-1-2 pure-u-sm-1-2 pure-u-md-1-2 pure-u-lg-1-4">' +
            '<h1>' + stats.rules.total + '</h1>' +
            '<p>Rules</p>' +
          '</div>';
        html += '<div class="pure-u-1-2 pure-u-sm-1-2 pure-u-md-1-2 pure-u-lg-1-4">' +
            '<h1>' + stats.selectors.total + '</h1>' +
            '<p>Selectors</p>' +
          '</div>';
        html += '<div class="pure-u-1-2 pure-u-sm-1-2 pure-u-md-1-2 pure-u-lg-1-4">' +
            '<h1>' + stats.declarations.total + '</h1>' +
            '<p>Declarations</p>' +
          '</div>';
        html += '<div class="pure-u-1-2 pure-u-sm-1-2 pure-u-md-1-2 pure-u-lg-1-4">' +
            '<h1>' + Object.keys(stats.declarations.properties).length + '</h1>' +
            '<p>Properties</p>' +
          '</div>';
        html += '</section>';

        // Declarations section
        html += '<section class="pure-g">';
        html += '<h1 class="pure-u-1">Total declarations</h1>';
        tmp = (stats.declarations.properties['font-size']) ? stats.declarations.properties['font-size'].length : '0';
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
            '<p>Font Size</p>' +
            '<h1>' + tmp + '</h1>' +
          '</div>';
        tmp = (stats.declarations.properties.float) ? stats.declarations.properties.float.length : '0';
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
            '<p>Float</p>' +
            '<h1>' + tmp + '</h1>' +
          '</div>';
        tmp = (stats.declarations.properties.width) ? stats.declarations.properties.width.length : '0';
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
            '<p>Width</p>' +
            '<h1>' + tmp + '</h1>' +
          '</div>';
        tmp = (stats.declarations.properties.height) ? stats.declarations.properties.height.length : '0';
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
            '<p>Height</p>' +
            '<h1>' + tmp + '</h1>' +
          '</div>';
        tmp = (stats.declarations.properties.color) ? stats.declarations.properties.color.length : '0';
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
            '<p>Color</p>' +
            '<h1>' + tmp + '</h1>' +
          '</div>';
        tmp = (stats.declarations.properties['background-color']) ? stats.declarations.properties['background-color'].length : '0';
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
            '<p>Background Color</p>' +
            '<h1>' + tmp + '</h1>' +
          '</div>';
        if ( options.importantDeclarations ) {
          html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
              '<p>!important</p>' +
              '<h1>' + stats.declarations.important.length + '</h1>' +
            '</div>';
        }
        if ( options.vendorPrefixedProperties ) {
          html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
              '<p>Vendors properties</p>' +
              '<h1>' + stats.declarations.getVendorPrefixed().length + '</h1>' +
            '</div>';
        }
        if ( options.repeatedSelectors ) {
          html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
              '<p>Repeated selectors</p>' +
              '<h1>' + stats.selectors.getRepeatedValues().length + '</h1>' +
            '</div>';
        }
        if ( options.propertyResets ) {
          tmp = 0;
          var resets = stats.declarations.getPropertyResets();
          for ( i in resets ) {
            if ( resets.hasOwnProperty( i ) ) {
              tmp += resets[ i ];
            }
          }

          html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
              '<p>Property resets</p>' +
              '<h1>' + tmp + '</h1>' +
            '</div>';
        }
        html += '</section>';

        // Colors section
        if ( stats.declarations.properties.color ) {
          html += '<section class="pure-g">';
          html += '<h1 class="pure-u-1">' + stats.declarations.getUniquePropertyCount('color') + ' Unique colors</h1>';
          var usedColors = {};
          stats.declarations.properties.color.forEach(function( color ) {
            if ( !usedColors[color] ) {
              html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
                  '<h1 style="color: ' + color + '; text-shadow: 1px 1px #A09F9F; line-height: 0; margin-bottom: 25px;" class="paper-font-display2">Aa</h1>' +
                  '<p>' + color + '</p>' +
                '</div>';
            }

            usedColors[ color ] = true;
          });
          html += '</section>';
        }

        // Background color section
        if ( stats.declarations.properties[ 'background-color' ] ) {
          html += '<section class="pure-g">';
          html += '<h1 class="pure-u-1">' + stats.declarations.getUniquePropertyCount('background-color') + ' Unique background-colors</h1>';
          var usedBgc = {};
          stats.declarations.properties[ 'background-color' ].forEach(function( bgc ) {
            if ( !usedBgc[ bgc ] ) {
              html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6">' +
                  '<div style="background-color: ' + bgc + '; border: 1px solid #cacaca; height: 20vh; max-width: 20vh;"></div>' +
                  '<p>' + bgc + '</p>' +
                '</div>';
            }

            usedBgc[ bgc ] = true;
          });
          html += '</section>';
        }

        // Font size section
        if ( stats.declarations.getAllFontSizes().length > 0 ) {
          var fontSizes = [];
          stats.declarations.getAllFontSizes().forEach(function( fz ) {
            if ( fontSizes.indexOf( fz ) < 0 ) {
              fontSizes.push( fz );
            }
          });

          html += '<section class="pure-g">';
          html += '<h1 class="pure-u-1">' + fontSizes.length + ' Unique font-sizes</h1>';
          html += '<div style="font-size: 16px">';
          fontSizes.forEach(function( fz ) {
            html += '<p style="font-size: ' + fz + '; line-height: 1em">Font size ' + fz + '</p>';
          });
          html += '</div>';
          html += '</section>';
        }

        // Font family section
        // if ( stats.declarations.getAllFontFamilies().length > 0 ) {
        //   var fontFamilies = [];
        //   stats.declarations.getAllFontFamilies().forEach(function( ff ) {
        //     if ( fontFamilies.indexOf( ff ) < 0 ) {
        //       fontFamilies.push( ff );
        //     }
        //   });
        //
        //   html += '<section class="pure-g">';
        //   html += '<h1 class="pure-u-1">' + fontFamilies.length + ' Unique font-families</h1>';
        //   fontFamilies.forEach(function( ff ) {
        //     html += '<p style="font-family:' + ff + '">' + ff + '</p>';
        //   });
        //   html += '</section>';
        // }

        // Unique vs total section
        html += '<section class="pure-g">';
        html += '<h1>Total vs. Unique Declarations</h1>';
        if ( stats.declarations.properties.width ) {
          tmp = {
            name: 'Width',
            value1: stats.declarations.properties.width.length,
            value2: stats.declarations.getUniquePropertyCount( 'width' ),
            total: stats.declarations.properties.width.length + stats.declarations.getUniquePropertyCount( 'width' )
          };
        } else {
          tmp = { name: 'Width', value1: 0, value2: 0, total: 1 };
        }
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6" style="text-align: center">' +
            createColumns( tmp ) +
          '</div>';

        if ( stats.declarations.properties.height ) {
          tmp = {
            name: 'Height',
            value1: stats.declarations.properties.height.length,
            value2: stats.declarations.getUniquePropertyCount( 'height' ),
            total: stats.declarations.properties.height.length + stats.declarations.getUniquePropertyCount( 'height' )
          };
        } else {
          tmp = { name: 'Height', value1: 0, value2: 0, total: 1 };
        }
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6" style="text-align: center">' +
            createColumns( tmp ) +
          '</div>';

        if ( stats.declarations.properties.margin ) {
          tmp = {
            name: 'Margin',
            value1: stats.declarations.properties.margin.length,
            value2: stats.declarations.getUniquePropertyCount( 'margin' ),
            total: stats.declarations.properties.margin.length + stats.declarations.getUniquePropertyCount( 'margin' )
          };
        } else {
          tmp = { name: 'Margin', value1: 0, value2: 0, total: 1 };
        }
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6" style="text-align: center">' +
            createColumns( tmp ) +
          '</div>';

        if ( stats.declarations.properties.padding ) {
          tmp = {
            name: 'Padding',
            value1: stats.declarations.properties.padding.length,
            value2: stats.declarations.getUniquePropertyCount( 'padding' ),
            total: stats.declarations.properties.padding.length + stats.declarations.getUniquePropertyCount( 'padding' )
          };
        } else {
          tmp = { name: 'Padding', value1: 0, value2: 0, total: 1 };
        }
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6" style="text-align: center">' +
            createColumns( tmp ) +
          '</div>';

        if ( stats.declarations.properties.color ) {
          tmp = {
            name: 'Color',
            value1: stats.declarations.properties.color.length,
            value2: stats.declarations.getUniquePropertyCount( 'color' ),
            total: stats.declarations.properties.color.length + stats.declarations.getUniquePropertyCount( 'color' )
          };
        } else {
          tmp = { name: 'Color', value1: 0, value2: 0, total: 1 };
        }
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6" style="text-align: center">' +
            createColumns( tmp ) +
          '</div>';

        if ( stats.declarations.properties[ 'background-color' ] ) {
          tmp = {
            name: 'Background-color',
            value1: stats.declarations.properties[ 'background-color' ].length,
            value2: stats.declarations.getUniquePropertyCount( 'background-color' ),
            total: stats.declarations.properties[ 'background-color' ].length + stats.declarations.getUniquePropertyCount( 'background-color' )
          };
        } else {
          tmp = { name: 'Background-color', value1: 0, value2: 0, total: 1 };
        }
        html += '<div class="pure-u-1-2 pure-u-md-1-3 pure-u-lg-1-6" style="text-align: center">' +
            createColumns( tmp ) +
          '</div>';
        html += '</section>';

        // mediaQueries section
        if ( options.mediaQueries ) {
          html += '<section class="pure-g">';
          html += '<h1>' + stats.mediaQueries.unique + ' Media Queries</h1>';
          var usedMq = {};
          stats.mediaQueries.values.forEach(function( mediaQuery ) {
            if ( !usedMq[ mediaQuery ] ) {
              html += '<div class="pure-u-md-1-2 pure-u-lg-1-3" style="margin-bottom: 2em">' + mediaQuery + '</div>';
            }
            usedMq[ mediaQuery ] = true;
          });
          html += '</section>';
        }

        // specificityGraph section
        // TODO : Find a way to integrate specificity-graph /!\
        if ( options.specificityGraph ) {
          html += '<section class="pure-g">';
          html += '<h1>Specificity Graph</h1>';
          tmp = stats.selectors.getSpecificityGraph();

          // get the max item
          var maxHeight = Math.max.apply( null, tmp );
          // set a coef to keep a good height for the element
          var heightCoef = ( maxHeight <= 5 ) ? 100 : ( maxHeight <= 50 ) ? 10 : ( maxHeight <= 100 ) ? 5 : 2;
          var itemWitdth = 95 / tmp.length;
          var height;
          i = 5;

          html += '<div class="pure-u-1" style="height: ' + (maxHeight * heightCoef) + 'px; margin-top: 40px; position: relative;">';

          if ( maxHeight > 1 ) {
            for ( var y = 0; y < maxHeight; y += Math.round( maxHeight / 4 ) ) {
              html += '<p style="position: absolute; left: 0; bottom: ' + (y * heightCoef) + 'px; margin: 0; border-bottom: 1px solid #d7d0d0; width: 100%;">' + y + '</p>';
            }
          }
          html += '<p style="position: absolute; left: 0; bottom: ' + (maxHeight * heightCoef) + 'px; margin: 0; border-bottom: 1px solid #d7d0d0; width: 100%;">' + maxHeight + '</p>';
          tmp.forEach(function( value ) {
            height = value * heightCoef;
            html += '<div style="position: absolute; bottom: 0; left: ' + i + '%;width: ' + itemWitdth + '%; height: ' + height + 'px; background-color: #37474f"></div>';
            i += itemWitdth;
          });
          html += '</div>';
          html += '</section>';
        }

        callback( null, {
          file: file,
          data: html
        } );

      } );
    } );
  }
};

var createColumns = function ( data ) {
  var value1 = Math.round( ( data.value1 / data.total ) * 100 ) ;
  var value2 = Math.round( ( data.value2 / data.total ) * 100 ) ;
  return (
  // Columns
  '<div class="pure-g" style="height: 200px; position: relative">' +
    '<div class="pure-u-sm-1-2 blue-grey-900" style="height: ' + value1 + '%; position: absolute; bottom: 0; left: 10%; width: 30%; background-color: #37474f; color: white;">' + data.value1 + '</div>' +
    '<div class="pure-u-sm-1-2 blue-grey-500" style="height: ' + value2 + '%; position: absolute; bottom: 0; right: 10%; width: 30%; background-color: #607d8b; color: white;">' + data.value2 + '</div>' +
  '</div>' +
  // columns title
  '<div class="pure-g">' +
    '<div class="pure-u-sm-1-2">' +
      '<p>Total</p>' +
    '</div>' +
    '<div class="pure-u-sm-1-2">' +
      '<p>Unique</p>' +
    '</div>' +
    '<h1 style="margin: 0">' + data.name + '</h1>' +
  '</div>' );
};
