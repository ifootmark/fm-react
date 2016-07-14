
var webpack = require('webpack');
var path = require("path");
var header = require('gulp-header');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var BannerPlugin = new webpack.BannerPlugin(buildBanner());
var glob = require("glob");
var rootPath='./';

function buildBanner () {
    var pkg = require('./package.json');
    var banner = [
        ''+ pkg.name +' - '+ pkg.description,
        '@author '+ pkg.author,
        '@version v'+ pkg.version,
        '@link '+ pkg.homepage,
        '@license '+ pkg.license,
        '@time '+ getTime()
    ].join('\n');
    return banner;
}

var getEntry=function(fname){
    var entry={};
    if(fname){
        entry[fname] = rootPath+'assets/js/src/'+fname+'.ent.js';
    }else{
        glob.sync(rootPath+'assets/js/src/*.ent.js').forEach(function (name) {
            var ne = name.match(/([^/]+?)\.ent\.js/)[1];
            entry[ne] = rootPath+'assets/js/src/' + ne + '.ent.js';
        });
    }
    entry.vendor=['jquery','react','react-dom','signals','semantic','component','lib'];
    return entry;
}

module.exports = { 
    listenEntry: function (fname) {
        this.entry = getEntry(fname);
    },
    refreshEntry: function () {
        this.entry = getEntry();
    },
    entry: getEntry(),
    output: {
        path: path.join(__dirname, './dist/assets'),
        publicPath: '/assets/',
        filename: 'js/[name].js' 
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        //{ test: /\.css$/,loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
        { test: /\.js[x]?$/, loaders: ['jsx?harmony'], exclude: /node_modules/ },
        { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
        { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192&name=img-h/[name].[hash].[ext]'},
        { test: /\.coffee$/, loader: 'coffee'},
        { test: /\.html$/,   loader: 'html'},
        { test: /\.json$/,   loader: 'json'},
        { test: /\.(woff|woff2)$/,   loader: "url?limit=8192&minetype=application/font-woff&name=fonts/[name].[ext]"},
        { test: /\.ttf$/,    loader: "file?name=fonts/[name].[ext]"},
        { test: /\.eot$/,    loader: "file?name=fonts/[name].[ext]"},
        { test: /\.svg$/,    loader: "file?name=fonts/[name].[ext]"}
      ]
    },
    resolve: {
        root: path.resolve(rootPath+'assets'),
        extensions: ['', '.js', '.jsx', '.json', '.scss'],
        alias: {
            jquery : 'js/utils/jquery-2.2.0.min.js',
            semantic : '3rd/semantic/semantic.min.js',
            uploadify : '3rd/uploadify/jquery-uploadify.js',
            signals : 'js/utils/signals.min.js',
            template : 'js/utils/template.js',
            lodash : 'js/utils/lodash.min.js',
            lib : 'js/utils/lib.js',
            component : 'js/utils/component.js'
        }
    },
    plugins: [
        BannerPlugin, 
        //new ExtractTextPlugin("css/[name].css"),
        new CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.js',
            minChunks: 2,
            //chunks: ["main","form"]
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            signals: 'signals',
            _: 'lodash',
            React: 'react',
            ReactDOM: 'react-dom',
            template: 'template',
            component: 'component',
            lib: 'lib'
        })//,
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoErrorsPlugin()
    ],
    externals: {
        //jquery: "jQuery",
        //lodash: "_",
        //module:true
    },
    getTime:getTime()
};

function getTime(){
  var date=new Date();
  var year=date.getFullYear();
  var month=date.getMonth()+1;
  var d=date.getDate();
  var h=date.getHours();
  var m=date.getMinutes();
  var s=date.getSeconds();
  h=h<10?'0'+h:h;
  m=m<10?'0'+m:m;
  s=s<10?'0'+s:s;
  var time=year+'-'+month+'-'+d+' '+h+':'+m+':'+s;
  return time;
}