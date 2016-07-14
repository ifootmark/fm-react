/*!
 * fm-build-quickstart - fm-build-quickstart
 * @author ifootmark@163.com
 * @version v1.0.0
 * @link https://ifootmark.github.io/fm-build-quickstart/
 * @license MIT
 * @time 2016-6-22 23:41:22
 */
webpackJsonp([0],[
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

	    $("table tbody tr").not('[data-pid="0"]').hide();
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
	    }

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

	//menu
	var ComMenu = React.createClass({displayName: "ComMenu",
	    render: function() {
	        return (           
	             React.createElement("div", null, 
	                React.createElement("a", {className: "ui icon basic button", href: "/category/add.html"}, React.createElement("i", {className: "add icon"}), " 添加分类 ")
	            )
	        );
	    }
	});


	//search
	var ComSearch = React.createClass({displayName: "ComSearch",
	    search: function() {
	        var arg={};
	        var categoryId=$('#categoryId').val();
	        var status=$('#status').val();    
	        arg.brandName=$('#brandName').val();
	        arg.categoryId=categoryId==-1?"":categoryId;
	        arg.status=status==-1?"":status;
	        component.signalsObj.search.dispatch(1,arg);
	    },
	    reset: function() {
	        $('body').form('set values', {
	            brandName: '',
	            categoryId: -1,
	            status: -1
	        });
	    },
	    complete:function(){
	        /*$('body').form('set values', {
	            categoryId: 10
	        });*/
	        lib.setFromData('#rp_aaa .item.lastone',{categoryId: 10});
	    },
	    render: function() {
	        return (
	            React.createElement("div", {className: "ui stackable grid"}, 
	                React.createElement("div", {className: "row"}, 
	                    React.createElement("div", {className: "three wide column"}, 
	                        React.createElement(component.ComInput, {title: "品牌", name: "brandName", labeled: true})
	                    ), 
	                    React.createElement("div", {className: "three wide column", id: "rp_aaa"}, 
	                        React.createElement(component.ComDropdownCategory, {title: "类目", name: "categoryId", dataurl: "/data/category.txt", complete: this.complete, labeled: true, isAllEnable: false})
	                    ), 
	                    React.createElement("div", {className: "three wide column"}, 
	                        React.createElement(component.ComSelect, {title: "状态", name: "status", labeled: true, defaultText: "全部", dataurl: "/data/status.txt", valueField: "code", textField: "name"})
	                    ), 
	                    React.createElement("div", {className: "three wide column"}, 
	                        React.createElement("div", {className: "ui primary button", id: "btn_search", onClick: this.search}, "查询"), 
	                        React.createElement("div", {className: "ui button", onClick: this.reset}, "重置")
	                    )
	                )
	            )
	        );
	    }
	});

	function ComFormBrand(){
	    var data=[{title:"序列",field:"brandId"},
	    {title:"LOGO",field:"brandLogo",type:"img",styleimg:{maxWidth:"40px"}},
	    {title:"品牌名称",field:"brandName"},
	    {title:"品牌编码",field:"brandCode"},
	    {title:"归属地",field:"attribution"},
	    {title:"状态",field:"status",classname:"vstate"},
	    {title:"关联类目",field:"categoryName"},
	    {title:"操作",type:"html",html:'',classname:"dataop"}];
	    //list
	    this.ComList = React.createClass({displayName: "ComList",
	        render: function() {
	            return (           
	                React.createElement("div", {className: "ui fluid container icontainer"}, 
	                    React.createElement("h3", {className: "ui header"}, this.props.title), 
	                    React.createElement("div", {className: "ui divider"}), 

	                    React.createElement(ComSearch, null), React.createElement("br", null), 
	                    React.createElement(component.ComTable, {data: data, pkey: "brandId", dataurl: "/data/brand.txt", complete: formatData, ispage: true}), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null)
	                )
	            );
	        }
	    });
	}
	ComFormBrand.prototype.init = function () {
	    ReactDOM.render(React.createElement(this.ComList, {title: "品牌管理"}),document.getElementById('rp_zone'));
	};

	(function(){
	    var form;
	    form = new ComFormBrand();
	    form.init();
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3), __webpack_require__(4), __webpack_require__(161), __webpack_require__(163)))

/***/ }
]);