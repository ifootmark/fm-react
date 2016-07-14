/*!
 * fm-build-quickstart - fm-build-quickstart
 * @author ifootmark@163.com
 * @version v1.0.0
 * @link https://ifootmark.github.io/fm-build-quickstart/
 * @license MIT
 * @time 2016-6-22 23:41:22
 */
webpackJsonp([4],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, $, lib, component, ReactDOM) {/** @jsx React.DOM **/
	function ComForm(){
	    this.ComBrandFrom = React.createClass({displayName: "ComBrandFrom",
	        componentDidMount: function() {            
	            $("#autocode").on({
	                change: function () {
	                    if($(this).is(":checked")){
	                        $('#brandCode').attr('readonly',true);    
	                    }else{
	                        $('#brandCode').removeAttr('readonly');
	                    }
	                }
	            })
	        },
	        handleSubmit:function(e){
	            $('.submit.button').addClass('disabled');
	            var $form = $('form'),
	            param = $form.form('get values', ['brandName', 'brandCode','brandLogo','status','attribution','categoryIds']);
	            
	            if(!this.validate(param)){
	                $('.submit.button').removeClass('disabled');
	                return false;
	            }
	        },
	        validate:function(param){
	            if(lib.validate.isNull(param.brandName)){
	                lib.dialog.msg('品牌名称不能为空','error');
	                $('#brandName').focus();
	                return false;
	            }
	            if(lib.validate.isNull(param.brandCode)){
	                lib.dialog.msg('品牌编码不能为空','error');
	                $('#brandCode').focus();
	                return false;
	            }
	            if(lib.validate.isNull(param.categoryIds)||param.categoryIds==-1){
	                lib.dialog.msg('请选择类目','error');
	                $('#categoryIds').focus();
	                return false;
	            }
	            return true;
	        },
	        back:function() {
	            history.go(-1);
	        },
	        render: function() {
	            return(

	            	React.createElement("div", {className: "ui fluid container icontainer"}, 
				        React.createElement("h3", {className: "ui header"}, "Form"), 
				        React.createElement("div", {className: "ui divider pb30"}), 

		                React.createElement("form", {className: "ui form"}, 
		                    React.createElement("div", {className: "inline field"}, 
		                        React.createElement(component.ComInput, {title: "品牌名称：", name: "brandName"}), 
		                        React.createElement("div", {className: "pl80 pt5 pb10 fontgray"}, "品牌名称不能重复。")
		                    ), 
		                    React.createElement("div", {className: "inline field"}, 
		                        React.createElement(component.ComInput, {title: "品牌编码：", name: "brandCode", complete: null, readonly: false, autocode: false}), 
		                        React.createElement("div", {className: "pl80 pt5 pb10 fontgray"}, "编码生成后不可修改。")
		                    ), 
		                    React.createElement("div", {className: "inline field"}, 
		                        React.createElement("label", {className: "indent25"}, "状态："), 
		                        React.createElement(component.ComCheckbox, {title: "使用中", name: "status", id: "status_y", type: "radio", checked: true, value: "1"}), "    ", 
		                        React.createElement(component.ComCheckbox, {title: "禁用中", name: "status", id: "status_n", type: "radio", value: "2"}), 
		                        React.createElement("div", {className: "pl80 pt5 pb10 fontgray"}, "一旦禁用，该品牌下的所有商品将不显示。请谨慎操作。")
		                    ), 

		                    React.createElement("div", {className: "inline field"}, 
		                        React.createElement(component.ComSelect, {classname: "indent15", title: "归属地：", name: "attribution", dataurl: "/data/region.txt", valueField: "code", textField: "name"})
		                    ), 
		                    React.createElement("div", {className: "inline field"}, 
		                        React.createElement(component.ComDropdownCategory, {classname: "indent25", title: "类目：", name: "categoryIds", dataurl: "/data/category.txt", defaultText: "请选择", multiple: true})
		                    ), 
		                    React.createElement("div", {className: "pl80 pt20"}, 
		                        React.createElement("div", {className: "ui blue submit button", onClick: this.handleSubmit}, "提交"), 
		                        React.createElement("div", {className: "ui button", onClick: this.back}, "返回")
		                    )
		                )
				    )
	            );
	        }
	    });
	}

	ComForm.prototype.init = function () {
		ReactDOM.render(React.createElement(this.ComBrandFrom, null), document.getElementById('rp_zone'));
	};

	(function(){
	    var form = new ComForm();
	    form.init();
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1), __webpack_require__(3), __webpack_require__(161), __webpack_require__(163)))

/***/ }
]);