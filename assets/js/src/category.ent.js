/** @jsx React.DOM **/
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
var ComNav = React.createClass({
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
            <div className="ui red secondary pointing menu">
                <a className="item active" onClick={this.search.bind(this,2)}>商品 </a>
                <a className="item" onClick={this.search.bind(this,3)}>服务 </a>
                <a className="item" onClick={this.search.bind(this,4)}>虚拟 </a>
            </div>
        );
    }
});

//Category
var ComAddCategory = React.createClass({
    render: function() {
        return (           
             <div>
                <a className="ui icon basic button" href="#"><i className="add icon"></i> 添加分类 </a>
            </div>
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
    this.ComList = React.createClass({
        render: function() {
            return (  
                <div className="ui fluid container icontainer">
                    <h3 className="ui header">{this.props.title}</h3>
                    <div className="ui divider"></div>         
                    <ComNav /><br/>
                    <component.ComTable data={data} pkey="categoryId" dataurl="/data/category.txt" defaultparam={{categoryId:2}} complete={formatData} ispage={false}/><br/><br/><br/>
                </div>
            );
        }
    });
}
ComFormCategory.prototype.init = function () {
    ReactDOM.render(<this.ComList title='分类管理'/>,document.getElementById('rp_zone'));
};


(function(){
    var form;
    form = new ComFormCategory();
    form.init();
})();
