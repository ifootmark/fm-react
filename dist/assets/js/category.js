/*!
 * fm-build-quickstart - fm-build-quickstart
 * @author ifootmark@163.com
 * @version v1.0.0
 * @link https://ifootmark.github.io/fm-build-quickstart/
 * @license MIT
 * @time 2016-6-22 23:41:22
 */
webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, lib, React, component, ReactDOM) {/** @jsx React.DOM **/
	var formatData=function(data) { 
	    if(data){
	        for(var i=0;i<data.length;i++){
	            var tr=$("tbody tr").eq(i);
	            var dataop=tr.find('.dataop');
	            dataop.html('<a href="javascript:void(0);" >编辑</a><a href="javascript:void(0);">删除</a>');
	        }
	    }

	    /*$("table tbody tr").not('[data-pid="0"]').hide();
	    $("table tbody tr").on({
	        click: function () {
	            $("table tbody tr").removeClass('warning');
	            $(this).addClass('warning');
	            var accordion=$(this).find('.icon.accordion');
	            if(accordion){
	                var pid=$(this).attr('data-rid');
	                if(accordion.hasClass("plus")){
	                    $('table tbody tr[data-pid="'+pid+'"]').show();
	                    accordion.removeClass('plus').addClass('minus');
	                }else{
	                    accordion.removeClass('minus').addClass('plus');
	                    recurseHide(pid);
	                }
	            }
	            return false;
	        }
	    });
	    var recurseHide=function(pid){
	        $('table tbody tr[data-pid="'+pid+'"]').each(function(){
	            $(this).hide();
	            $(this).find('.icon.accordion').removeClass('minus').addClass('plus');
	            recurseHide($(this).attr('data-rid'));
	        });
	    }*/

	    $(".dataop a").on({
	        click: function () {
	            var obj=$(this);
	            var index=obj.index();
	            var tr=lib.getParentNode('tr',obj);
	            var rid=tr.attr('data-rid');
	            var status=tr.attr('status');
	            if(index==0){
	                lib.dialog.msg("不可用","error");
	            }else if(index==1){
	                var msg=obj.text();
	                lib.dialog.show('确定要'+msg+'吗？',function() {
	                    lib.dialog.close("idlg");
	                });                
	            }
	            return false;
	        }
	    });
	}

	//nav
	var ComNav = React.createClass({displayName: "ComNav",
	    search: function(cid) {
	        var arg={};
	        arg.categoryId=cid;
	        component.signalsObj.search.dispatch(1,arg);
	    },
	    componentDidMount: function() {
	        $(".secondary.pointing.menu a").on({
	            click: function () {
	                $(".secondary.pointing.menu a").removeClass('active');
	                $(this).addClass('active');
	            }
	        });
	    },
	    render: function() {
	        return (
	            React.createElement("div", {className: "ui red secondary pointing menu"}, 
	                React.createElement("a", {className: "item active", onClick: this.search.bind(this,2)}, "商品 "), 
	                React.createElement("a", {className: "item", onClick: this.search.bind(this,3)}, "服务 "), 
	                React.createElement("a", {className: "item", onClick: this.search.bind(this,4)}, "虚拟 ")
	            )
	        );
	    }
	});

	//Category
	var ComAddCategory = React.createClass({displayName: "ComAddCategory",
	    render: function() {
	        return (           
	             React.createElement("div", null, 
	                React.createElement("a", {className: "ui icon basic button", href: "#"}, React.createElement("i", {className: "add icon"}), " 添加分类 ")
	            )
	        );
	    }
	});

	function ComFormCategory(){
	    var data=[
	    {title:"分类名称",field:"categoryName"},
	    {title:"编辑",field:"categoryCode"},
	    {title:"状态",field:"status",classname:"vstate"},
	    {title:"操作",type:"html",html:'',classname:"dataop"}];
	    //list
	    this.ComList = React.createClass({displayName: "ComList",
	        render: function() {
	            return (  
	                React.createElement("div", {className: "ui fluid container icontainer"}, 
	                    React.createElement("h3", {className: "ui header"}, this.props.title), 
	                    React.createElement("div", {className: "ui divider"}), 
	                    React.createElement(ComNav, null), React.createElement("br", null), 
	                    React.createElement(component.ComTable, {data: data, pkey: "categoryId", dataurl: "/data/category.txt", defaultparam: {categoryId:2}, complete: formatData, ispage: false}), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null)
	                )
	            );
	        }
	    });
	}
	ComFormCategory.prototype.init = function () {
	    ReactDOM.render(React.createElement(this.ComList, {title: "分类管理"}),document.getElementById('rp_zone'));
	};


	(function(){
	    var form;
	    form = new ComFormCategory();
	    form.init();
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3), __webpack_require__(4), __webpack_require__(161), __webpack_require__(163)))

/***/ }
]);