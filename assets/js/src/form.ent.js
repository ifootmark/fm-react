/** @jsx React.DOM **/
function ComForm(){
    this.ComBrandFrom = React.createClass({
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

            	<div className="ui fluid container icontainer">
			        <h3 className="ui header">Form</h3>
			        <div className="ui divider pb30"></div>

	                <form className="ui form">
	                    <div className="inline field">
	                        <component.ComInput title="品牌名称：" name="brandName"/>
	                        <div className="pl80 pt5 pb10 fontgray">品牌名称不能重复。</div>
	                    </div>
	                    <div className="inline field">
	                        <component.ComInput title="品牌编码：" name="brandCode" complete={null} readonly={false} autocode={false}/>
	                        <div className="pl80 pt5 pb10 fontgray">编码生成后不可修改。</div>
	                    </div>
	                    <div className="inline field">
	                        <label className="indent25">状态：</label>
	                        <component.ComCheckbox title="使用中" name="status" id="status_y" type="radio" checked={true} value="1"/>&nbsp;&nbsp;&nbsp;&nbsp;
	                        <component.ComCheckbox title="禁用中" name="status" id="status_n" type="radio" value="2"/>
	                        <div className="pl80 pt5 pb10 fontgray">一旦禁用，该品牌下的所有商品将不显示。请谨慎操作。</div>
	                    </div>

	                    <div className="inline field">
	                        <component.ComSelect classname="indent15" title="归属地：" name="attribution" dataurl="/data/region.txt" valueField="code" textField="name" />
	                    </div>
	                    <div className="inline field">
	                        <component.ComDropdownCategory classname="indent25" title="类目：" name="categoryIds" dataurl="/data/category.txt" defaultText="请选择" multiple={true}/>
	                    </div>
	                    <div className="pl80 pt20">
	                        <div className="ui blue submit button" onClick={this.handleSubmit}>提交</div>
	                        <div className="ui button" onClick={this.back}>返回</div>
	                    </div>
	                </form>
			    </div>
            );
        }
    });
}

ComForm.prototype.init = function () {
	ReactDOM.render(<this.ComBrandFrom />, document.getElementById('rp_zone'));
};

(function(){
    var form = new ComForm();
    form.init();
})();
