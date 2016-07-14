/*!
 * fm-build-quickstart - fm-build-quickstart
 * @author ifootmark@163.com
 * @version v1.0.0
 * @link https://ifootmark.github.io/fm-build-quickstart/
 * @license MIT
 * @time 2016-6-22 23:41:22
 */
webpackJsonp([6],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, ReactDOM) {/** @jsx React.DOM **/
	/**
	 * <TimeMessage elapsed={100} />
	 */
	var TimeMessage = React.createClass({displayName: "TimeMessage",
		render: function() {
			var elapsed = Math.round(this.props.elapsed / 100);
			var seconds = elapsed / 10 + (elapsed % 10 ? '' : '.0');

			// JSX code
			return React.createElement("p", null, " ", React.createElement("br", null), "   React Test ", React.createElement("br", null), "   React has been successfully running for ", seconds, " seconds. ");
		}
	});

	/**
	 * <Timer start={aDate} />
	 */
	var Timer = React.createClass({displayName: "Timer",
		getInitialState: function() {
			return {
				now: new Date()
			};
		},

		componentDidMount: function() {
			var that = this;
			setInterval(function() {
				that.setState({
					now: new Date()
				});
			}, 50);
		},

		render: function() {
			// JSX code
			var elapsed = this.state.now.getTime() - this.props.start.getTime();
			return React.createElement(TimeMessage, {elapsed: elapsed});
		}
	});


	(function(){
	    var start = new Date();
	    Timer = React.createFactory(Timer);
	    ReactDOM.render(
	        Timer({start: start}),
	        document.getElementById('rp_zone')
	    );
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(163)))

/***/ }
]);