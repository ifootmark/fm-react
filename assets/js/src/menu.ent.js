/** @jsx React.DOM **/
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
var ComMenu = React.createClass({
    render: function() {
        return (           
             <div>
                <a className="ui icon basic button" href="#"><i className="add icon"></i> 添加菜单 </a>
            </div>
        );
    }
});

function ComFormMenu(){
    var data=[{title:"菜单名称",field:"menuName",type:"tree"},
    {title:"排序",field:"menuOrder"},
    {title:"状态",field:"menuStatus",classname:"vstate"},
    {title:"操作",type:"html",html:'',classname:"dataop"}];
    //list
    this.ComList = React.createClass({
        render: function() {
            return (  
                <div className="ui fluid container icontainer">
                    <h3 className="ui header">{this.props.title}</h3>
                    <div className="ui divider"></div><br/>
                    <component.ComTreeTable data={data} pkey="menuId" dataurl="/data/menu.txt" defaultparam={null} complete={formatData} ispage={false} istree={true}/><br/><br/><br/>
                </div>
            );
        }
    });
}
ComFormMenu.prototype.init = function () {
    ReactDOM.render(<this.ComList title='菜单管理'/>,document.getElementById('rp_zone'));
};


(function(){
    var form;
    form = new ComFormMenu();
    form.init();
})();
