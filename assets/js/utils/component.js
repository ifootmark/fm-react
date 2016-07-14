/** @jsx React.DOM */
var component={};
var httpurl='';
component.signalsObj = {
    search : new signals.Signal(),
    handler : new signals.Signal()
};

var initDrop=function(){
    $('.ui.dropdown').dropdown({
        on: 'click'
    });
}

//loading
var Loading = React.createClass({
    getDefaultProps: function() {
        return {
            callback: null,
            content:'loading...'
        };
    },
    getInitialState: function () {
        return {
            loading: true
        }
    },
    showLoading: function () {
        this.setState({loading: true})
    },
    hideLoading: function () {
        this.setState({loading: false})
    },
    componentWillUnmount: function(){
        if(typeof this.props.callback === 'function'){
            setTimeout(this.props.callback, 10);
        }
    },
    render: function () {
        return (<div className="ui active centered inline loader" ref="loaderCircle"></div>);
    }
});


//input
component.ComInput = React.createClass({
    getDefaultProps: function() {
        return {
            title: '',
            labeled:false,
            readonly:false,
            autocode:false,
            complete:null
        };
    },
    componentDidMount: function() {
        if(this.props.complete){
            this.props.complete();
        }
    },
    render: function() {
        var titlestr=this.props.title.replace(/\：/,'');
        var titleClass=this.props.classname;
        var divClass='';
        if(this.props.labeled){
            divClass='ui labeled input';
            titleClass='ui label '+titleClass;
        }else{//
            divClass='inline field';
        }
        return(
            <div className={divClass}>
                {
                    !this.props.title?null:<label className={titleClass}>{this.props.title}</label>
                }
                <input type="text" placeholder={titlestr} name={this.props.name} id={this.props.name} readOnly={this.props.readonly ? "true" : ""} />&nbsp;&nbsp;&nbsp;&nbsp;
                {this.props.autocode ? <component.ComCheckbox title="勾选系统自动生成" name="autocode" id="autocode" checked=""/> : ""}
            </div>
        );
    }
});

//checkbox/radio
component.ComCheckbox = React.createClass({
    getDefaultProps: function() {
        return {
            title: '',
            name:'',
            id:'',
            checked:false,
            type:'checkbox',
            value:0
        };
    },
    getInitialState: function() {
        return {
            isChecked: this.props.checked
        };
    },
    toggleChange: function() {
        this.setState({
            isChecked: !this.state.isChecked
        });
    },
    componentDidMount: function() {
        $('.ui.checkbox').checkbox();
    },
    render: function() {
        if(this.props.type=="radio"){
            return(
                <div className="ui radio checkbox">
                    <input type="radio" tabIndex="0" value={this.props.value} name={this.props.name} id={this.props.id} defaultChecked={this.props.checked}/>
                    <label>{this.props.title}</label>
                </div>
            );
        }else{
            return(
                <div className="ui checkbox">
                    <input type="checkbox" tabIndex="0" value={this.props.value} name={this.props.name} id={this.props.id} checked={this.state.isChecked} onChange={this.toggleChange}/>
                    <label>{this.props.title}</label>
                </div>
            );            
        }

    }
});


/**
* category dropdown start
* item
*/
var ItemDropdown = React.createClass({
    render: function(){
        var isAllEnable=this.props.isAllEnable;
        var isRootSecondHide=this.props.isRootSecondHide;
        var igrd=isRootSecondHide?1:0;
        var indent=this.props.item.grade>igrd?(this.props.item.grade-1-igrd)*30:0;
        var className="item";
        /*if(!isAllEnable){
            if(!this.props.item.isLeaf){className+=" disabled";}       
        }*/
        if(this.props.islast){className+=" lastone";}
        return <div className={className} style={{textIndent: indent+"px",fontWeight:(this.props.item.isLeaf==0)?"bold":"normal",color:(this.props.item.isLeaf==0&&!this.props.isAllEnable)?"gray":"#000"}} data-value={this.props.item.categoryId} data-pid={this.props.item.parentId?this.props.item.parentId:0} >{this.props.item.isLeaf==0?<i className="caret right icon indent0 vcatetree"></i>:null}{this.props.item.categoryName}</div>;
    }
});
//category dropdown
component.ComDropdownCategory = React.createClass({
    getDefaultProps: function() {
        return {
            dataurl:'/category/treeList.json',
            title: '',
            name: 'category',
            defaultParam:null,
            defaultValue:-1,
            defaultText:'全部',
            classname:'',
            labeled:false,
            multiple:false,
            isAllEnable:true,
            complete:null
        };
    },
    getInitialState: function() {
        return {
            itemsData: [],
            formatData:[]
        };
    },
    recurseItems:function (categoryVOList) {
        if(categoryVOList){
            for(var i=0;i<categoryVOList.length;i++){
                this.state.formatData.push(categoryVOList[i]);
                if(categoryVOList[i].categoryVOList){
                    this.recurseItems(categoryVOList[i].categoryVOList);
                }
            }
        }
    },    
    componentDidMount: function() {
        initDrop();
        var param={};
        if(this.props.defaultParam){
            for (var key in this.props.defaultParam) {
                param[key] = this.props.defaultParam[key];
            }
        }
        lib.getJsonData("get", httpurl + this.props.dataurl, param, function (data) {
            data = typeof(data) == "string" ? eval('('+data+')') : data;
            if (data.webResult.data && data.webResult.success && data.webResult.stateCode.code == 0) {
                //var categoryVOList=data.webResult.data.categoryVOList;
                //this.recurseItems(categoryVOList);
                //var idata=_.filter(data.webResult.data, function(o) { return o.categoryCode!='AB'; });
                if (this.isMounted()) {
                    this.setState({
                        itemsData: data.webResult.data
                    }); 
                }
            }         
        }.bind(this));
    },
    componentDidUpdate: function() {
        this.buildTree();
        if(this.props.complete){
            this.props.complete();
        }
    },
    buildTree:function(){
        var _that=this;
        var refCategory = ReactDOM.findDOMNode(this.refs.refCategory);
        $(refCategory).dropdown({
            onChange: function(value, text, $selectedItem) {
                if(text.indexOf('caret')>=0){
                    $(refCategory).dropdown('set text', $selectedItem[0].innerText);
                }
            }
        });

        var ooo=$(refCategory).find('.vcatetree').parent();
        if(_that.props.isAllEnable){
            ooo=$(refCategory).find('.vcatetree');
        }

        $(ooo).on({
            click: function () {
                var pid=_that.props.isAllEnable?$(this).parent().attr('data-value'):$(this).attr('data-value');
                var iicon=_that.props.isAllEnable?$(this):$(this).find('.vcatetree');
                if(iicon.hasClass("right")){
                    $(refCategory).find('.item[data-pid="'+pid+'"]').show();
                    iicon.removeClass('right').addClass('down');
                }else{
                    iicon.removeClass('down').addClass('right');
                    _that.recurseHide(pid);
                }
                return false;
            }
        });

        if(this.props.defaultParam && this.props.defaultParam.categoryCode){
            $(refCategory).find('.item').not('[data-pid="2"]').not('[data-pid="3"]').not('[data-pid="4"]').hide();
        }else{
            $(refCategory).find('.item').not('[data-pid="1"]').hide();
        }
    },
    recurseHide:function(pid){
        var _that=this;
        var refCategory = ReactDOM.findDOMNode(this.refs.refCategory);
        $(refCategory).find('.item[data-pid="'+pid+'"]').each(function(){
            $(this).hide();
            $(this).find('.vcatetree').removeClass('down').addClass('right');
            _that.recurseHide($(this).attr('data-value'));
        });
    },
    render: function() {
        var selectClass=this.props.multiple ? 'ui search selection dropdown multiple' : 'ui search selection dropdown';
        var itemLength=this.state.itemsData.length;
        var isAllEnable=this.props.isAllEnable;
        var titleClass=this.props.classname;
        var divClass='';
        if(this.props.labeled){
            divClass='ui labeled input';
            titleClass='ui label '+titleClass;
        }else{
            divClass='inline field';
        }
        var isRootSecondHide=!!(this.props.defaultParam && this.props.defaultParam.categoryCode);
        return (
            <div className={divClass}>
                <label className={titleClass}> {this.props.title} </label>
                <div className={selectClass} ref="refCategory">
                    <input type="hidden" name={this.props.name} id={this.props.name} />
                    <i className="dropdown icon"></i>
                    <div className="default text">{this.props.defaultText}</div>
                    <div className="menu" style={{maxHeight:"600px"}}>
                        <div className="item" data-value={this.props.defaultValue}>{this.props.defaultText}</div>
                        {
                            this.state.itemsData.map(function(item,i) {
                                var islast=false
                                if(i==itemLength-1){
                                    islast=true;
                                }
                                return <ItemDropdown key={item.categoryId} item={item} islast={islast} isAllEnable={isAllEnable} isRootSecondHide={isRootSecondHide}/>;
                            })
                        }
                    </div>
                </div>
                {this.props.multiple ? <div className="ui left pointing label">可多选</div> : ''}
            </div>
        );
    }
});
/* category dropdown end */


/**
* Department dropdown start
* Department item
*/
var ItemDropdownDepartment = React.createClass({
    render: function(){
        var isAllEnable=this.props.isAllEnable;
        var indent=this.props.item.grade>0?(this.props.item.grade-1)*15:0;
        var className="item";
        if(!isAllEnable){
            if(this.props.item.childrenNum!=0){className+=" disabled";}       
        }
        if(this.props.islast){className+=" lastone";}
        return <div className={className} style={{textIndent: indent+"px",fontWeight:(this.props.item.childrenNum!=0)?"bold":"normal"}} data-value={this.props.item.deptId}>{this.props.item.deptName}</div>;
    }
});
//Department dropdown
component.ComDropdownDepartment = React.createClass({
    getDefaultProps: function() {
        return {
            dataurl:'',
            title: '',
            name: 'category',
            defaultValue:-1,
            defaultText:'全部',
            classname:'',
            labeled:false,
            multiple:false,
            isAllEnable:false,
            complete:null
        };
    },
    getInitialState: function() {
        return {
            itemsData: [],
            formatData:[]
        };
    },
    getDataList: function () {
        lib.getJsonData("get", httpurl + this.props.dataurl, null, function (data) {
            data = typeof(data) == "string" ? eval('('+data+')') : data;
            this.setDataList(data);  
        }.bind(this));
    },
    setDataList: function(data) {
        if (data.data && data.success && data.stateCode.code == 0) {
            if (this.isMounted()) {
                var fmtData=[];
                this.recurseNode(fmtData,data.data,1);
                var setStateObj={};
                setStateObj.itemsData=fmtData;
                this.setState(setStateObj,function(){});
            }
        }else{
            if (this.isMounted()) {
                this.setState({
                    itemsData: []
                },function () {});
            }
        }
    },
    recurseNode: function(fmtData,childrenNode,depth) {
        for(var i=0;i<childrenNode.length;i++){
            var node=childrenNode[i];
            var children=childrenNode[i].children;
            node.children=null;
            node.childrenNum=children.length;
            node.depth=depth;
            fmtData.push(node);
            if(children.length>0){
                this.recurseNode(fmtData,children,depth+1);
            }
        }
    },
    componentDidMount: function() {
        initDrop();
        this.getDataList();
    },
    componentDidUpdate: function() {
        if(this.props.complete){
            this.props.complete();
        }
    },
    render: function() {
        var selectClass=this.props.multiple ? 'ui search selection dropdown multiple' : 'ui search selection dropdown';
        var itemLength=this.state.itemsData.length;
        var isAllEnable=this.props.isAllEnable;
        var titleClass=this.props.classname;
        var divClass='';
        if(this.props.labeled){
            divClass='ui labeled input';
            titleClass='ui label '+titleClass;
        }else{
            divClass='inline field';
        }
        return (
            <div className={divClass}>
                <label className={titleClass}> {this.props.title} </label>
                <div className={selectClass}>
                    <input type="hidden" name={this.props.name} id={this.props.name} />
                    <i className="dropdown icon"></i>
                    <div className="default text">{this.props.defaultText}</div>
                    <div className="menu">
                        <div className="item" data-value={this.props.defaultValue}>{this.props.defaultText}</div>
                        {
                            this.state.itemsData.map(function(item,i) {
                                var islast=false
                                if(i==itemLength-1){
                                    islast=true;
                                }
                                return <ItemDropdownDepartment key={item.deptId} item={item} islast={islast} isAllEnable={isAllEnable}/>;
                            })
                        }
                    </div>
                </div>
                {this.props.multiple ? <div className="ui left pointing label">可多选</div> : ''}
            </div>
        );
    }
});
/* Department dropdown end */


/**
* ComSelect start
* ComSelect option
*/
var ComSelectOption = React.createClass({
    render: function(){
        var className='';
        if(this.props.islast){className="lastone";}
        return <option className={className} value={this.props.value}>{this.props.text}</option>;
    }
});
//ComSelect
component.ComSelect = React.createClass({
    getDefaultProps: function() {
        return {
            title: '',
            name: '',
            dataurl:'',
            defaultParam:null,
            defaultValue:-1,
            defaultText:'请选择',
            classname:'',
            labeled:false,
            valueField:'',
            textField:'',
            complete:null
        };
    },
    getInitialState: function() {
        return {
            itemsData: []
        };
    },
    getDataList: function (arg) { 
        var param={};
        if(arg){
            for (var key in arg) {
                param[key] = arg[key];
            }
        }else if(this.props.defaultParam){
            for (var key in this.props.defaultParam) {
                param[key] = this.props.defaultParam[key];
            }
        }
        if(this.props.dataurl){
            lib.getJsonData("get", httpurl + this.props.dataurl, param, function (data) {
                data = typeof(data) == "string" ? eval('('+data+')') : data;         
                if (data.webResult.data && data.webResult.success && data.webResult.stateCode.code == 0) {
                    if (this.isMounted()) {
                        this.setState({
                            itemsData: data.webResult.data
                        }); 
                    }
                }         
            }.bind(this));
        }
    },
    componentDidMount: function() {
        initDrop();
        this.getDataList();
    },
    componentDidUpdate: function() {
        if(this.props.complete){
            this.props.complete();
        }
    },
    render: function() {
        var itemLength=this.state.itemsData.length;
        var valueField=this.props.valueField;
        var textField=this.props.textField;
        var titleClass=this.props.classname;
        var divClass='';
        if(this.props.labeled){
            divClass='ui labeled input';
            titleClass='ui label '+titleClass;
        }else{
            divClass='inline field';
        }
        return (
            <div className={divClass}>
                {
                    !this.props.title?null:<label className={titleClass}>{this.props.title}</label>
                }
                <select className="ui search dropdown" name={this.props.name} id={this.props.name}>
                    <option value={this.props.defaultValue}>{this.props.defaultText}</option>
                    {
                        this.state.itemsData.map(function(item,i) {
                            var islast=false
                            if(i==itemLength-1){islast=true;}
                            return <ComSelectOption key={eval('item.'+valueField)} islast={islast} value={eval('item.'+valueField)} text={eval('item.'+textField)}/>;
                        })
                    }
                </select>
            </div>
        ); 
    }
});
/* ComSelect end */


//select brand
component.ComSelectBrand = React.createClass({
    getDefaultProps: function() {
        return {
            title: '',
            name: '',
            dataurl:'',
            defaultParam:null,
            defaultValue:-1,
            defaultText:'请选择',
            classname:'',
            labeled:false,
            valueField:'',
            textField:'',
            complete:null
        };
    },
    getInitialState: function() {
        return {
            itemsData: []
        };
    },
    getDataList: function (arg) { 
        var param={};
        if(arg){
            for (var key in arg) {
                param[key] = arg[key];
            }
        }else if(this.props.defaultParam){
            for (var key in this.props.defaultParam) {
                param[key] = this.props.defaultParam[key];
            }
        }
        if(this.props.dataurl){
            lib.getJsonData("get", httpurl + this.props.dataurl, param, function (data) {
                data = typeof(data) == "string" ? eval('('+data+')') : data;        
                if (data.webResult.data && data.webResult.success && data.webResult.stateCode.code == 0) {
                    if (this.isMounted()) {
                        this.setState({
                            itemsData: data.webResult.data
                        }); 
                    }
                }         
            }.bind(this));
        }
    },
    componentDidMount: function() {
        initDrop();
        this.getDataList();
        component.signalsObj.handler.add(this.getDataList);
    },
    componentDidUpdate: function() {
        if(this.props.complete){
            this.props.complete();
        }
    },
    componentWillUnmount: function () {
        component.signalsObj.handler.remove(this.getDataList);
    },
    render: function() {
        var itemLength=this.state.itemsData.length;
        var valueField=this.props.valueField;
        var textField=this.props.textField;
        var titleClass=this.props.classname;
        var divClass='';
        if(this.props.labeled){
            divClass='ui labeled input';
            titleClass='ui label '+titleClass;
        }else{
            divClass='inline field';
        }
        return (
            <div className={divClass}>
                {
                    !this.props.title?null:<label className={titleClass}>{this.props.title}</label>
                }
                <select className="ui search dropdown" name={this.props.name} id={this.props.name}>
                    <option value={this.props.defaultValue}>{this.props.defaultText}</option>
                    {
                        this.state.itemsData.map(function(item,i) {
                            var islast=false
                            if(i==itemLength-1){islast=true;}
                            return <ComSelectOption key={eval('item.'+valueField)} islast={islast} value={eval('item.'+valueField)} text={eval('item.'+textField)}/>;
                        })
                    }
                </select>
            </div>
        ); 
    }
});
/* ComSelectBrand dropdown end */


/**
* Table Component start
*/
//th
var ItemTh = React.createClass({
    render: function(){
        return (
            <th>{this.props.data}</th>
        )
    }
});
//td
var ItemTd = React.createClass({
    render: function(){
        var datatplitem=this.props.datatplitem;
        var type=!datatplitem.type?null:datatplitem.type;
        var field=!datatplitem.field?null:datatplitem.field;
        var html=!datatplitem.html?"":datatplitem.html;
        var style=!datatplitem.style?null:datatplitem.style;
        var styleimg=!datatplitem.styleimg?null:datatplitem.styleimg;
        var classname=!datatplitem.classname?null:datatplitem.classname;
        var fieldValue="";
        if(field){
            fieldValue=eval("this.props.data."+field);
        }
        //类目专用
        if(this.props.istree&&this.props.data.grade&&type=="tree"){
            if(field&&field=="categoryName"){       
                if(!style) style={}
                var indent=this.props.data.grade>1?(this.props.data.grade-2)*30:0;
                style.textIndent=indent+"px";
                style.fontWeight=(this.props.data.isLeaf==0||this.props.data.grade==2)?"bold":"normal";
                return (
                    <td style={style} className={classname}>{this.props.data.isLeaf==0?<i className="large grey plus square outline icon indent0 accordion"></i>:null}{fieldValue}</td>
                )
            }
        }
        //
        if(this.props.istree&&this.props.data&&type=="tree"){
            if(field){       
                if(!style) style={}
                var indent=this.props.data.depth>0?(this.props.data.depth-1)*30:0;
                style.textIndent=indent+"px";
                style.fontWeight=(this.props.data.childrenNum>0)?"bold":"normal";
                return (
                    <td style={style} className={classname}>{this.props.data.childrenNum>0?<i className="large grey plus square outline icon indent0 accordion"></i>:null}{fieldValue}</td>
                )
            }
        }

        /*if(type=="multiple"){
            for (var key in fieldValue) {
                if (fieldValue[key]) {
                    console.log(fieldValue[key]);
                    return (
                        <td style={style} className={classname}>{fieldValue[key]}</td>
                    ) 
                }
            }
        } */

        if(type=="html"){
            return (
                <td style={style} className={classname}>{<div dangerouslySetInnerHTML={{__html: html}}></div>}</td>
            )                
        }else if(type=="checkbox"||type=="radio"){
            var linkhtml='&nbsp;&nbsp;&nbsp;&nbsp;<div class="ui '+type+' checkbox"><input type="'+type+'" name="icheckbox" id="ck_'+this.props.pkey+'" value="ck_'+this.props.pkey+'"><label></label></div>';
            return (
                <td style={style} className={classname}>{<div dangerouslySetInnerHTML={{__html: linkhtml}}></div>}</td>
            )
        }else if(type=="link"){
            var linkhtml='<a href="'+html+'='+this.props.pkey+'" target="_blank" >'+fieldValue+'</a>';
            return (
                <td style={style} className={classname}>{<div dangerouslySetInnerHTML={{__html: linkhtml}}></div>}</td>
            )
        }else if(type=="img"){
            return (
                <td style={style} className={classname}><img src={fieldValue} style={styleimg}/></td>
            )
        }else if(type=="bool"){
            if(fieldValue==true) fieldValue="1"
            else if(fieldValue==false) fieldValue="0"
            else fieldValue=""
            return (
                <td style={style} className={classname}>{fieldValue}</td>
            )
        }else if(field){
            return (
                <td style={style} className={classname}>{fieldValue}</td>
            )
        }
    }
});
//tr
var ItemTr = React.createClass({
    render: function(){
        var dataitem=this.props.data;
        var keyid=eval("this.props.data."+this.props.pkey);
        var istreelist=this.props.istree;
        var pid=dataitem.parentId?dataitem.parentId:0;//parentId
        return (
            <tr data-rid={keyid} data-pid={pid}>
                {
                    this.props.datatpl.map(function(item,key) {
                        return <ItemTd key={!item.field?"":item.field} pkey={keyid} datatplitem={item} data={dataitem} istree={istreelist}/>;
                    })
                }
            </tr>
        )
    }
});

//table
component.ComTable = React.createClass({
    getDefaultProps: function() {
        return {
            data: [],
            pkey: '',
            dataurl:'',
            changestatus:null,
            ispage:true,
            defaultparam:null,
            istree:false,
            complete:null
        };
    },
    getInitialState: function() {
        return {
            itemsData: [],
            curpage:1,
            itemCount:0,
            pageSize: 20,
            parameter:this.props.defaultparam
        };
    },
    loadingHide:function() {
        var loaderCircle = ReactDOM.findDOMNode(this.refs.loaderCircle);
        $(loaderCircle).hide();
    },
    setOperation:function() {
        if(this.props.complete){
            this.props.complete(this.state.itemsData);
        }
    },
    getDataList: function (page,arg) {
        arg=arg||null;
        var param={};
        if(arg){
            for (var key in arg) {
                param[key] = arg[key];
            }
        }else if(this.state.parameter){
            for (var key in this.state.parameter) {
                param[key] = this.state.parameter[key];
            }
        }
        if(this.props.ispage){
            param.pageNumber=page;
            param.pageSize=this.state.pageSize;           
        }

        lib.getJsonData("get", httpurl + this.props.dataurl, param, function (data) {
            data = typeof(data) == "string" ? eval('('+data+')') : data;
            this.setDataList(data,page,param);  
        }.bind(this));
    },
    setDataList: function(data,page,param) {
        if (data.webResult.data && data.webResult.success && data.webResult.stateCode.code == 0) {
            if (this.isMounted()) {
                var setStateObj={};
                setStateObj.itemsData=data.webResult.data;
                setStateObj.curpage=page;
                setStateObj.itemCount=data.webResult.totalCount;
                if(page==1){
                    setStateObj.parameter=param;
                }
                this.setState(setStateObj,function(){});
            }
        }else{
            if (this.isMounted()) {
                this.setState({
                    itemsData: [],
                    curpage:page,
                    itemCount:0,
                    parameter:null
                },function () {});
            }
        }
        this.loadingHide();
    },
    componentDidMount: function() {
        //this.getDataList(1);
        var pagNum=1;
        if(this.state.parameter&&this.state.parameter.pageNumber){
            pagNum=this.state.parameter.pageNumber;
        }
        this.getDataList(pagNum);
        component.signalsObj.search.add(this.getDataList);
    },
    componentWillUnmount: function () {
        component.signalsObj.search.remove(this.getDataList);
    },    
    componentDidUpdate: function() {
        this.setOperation();
    },
    render: function(){
        var datatpl=this.props.data;
        var pkey=this.props.pkey;
        var istreelist=this.props.istree;
        return (
            <div>
                <table className="ui selectable celled table">
                    <thead>
                        <tr>
                        {
                            this.props.data.map(function(item) {
                                return <ItemTh key={item.title} data={item.title}/>;
                            })
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.itemsData.map(function(item) {
                            	
                                return <ItemTr key={eval("item."+pkey)} pkey={pkey} data={item} datatpl={datatpl} istree={istreelist}/>;
                            })
                        }
                    </tbody>
                </table>
                {
                    this.props.ispage?<ComPage onChangPage={this.getDataList} page={this.state.curpage} itemCount={this.state.itemCount} pagesize={this.state.pageSize}/>:null
                }
                <div className="ui text active centered inline loader" ref="loaderCircle">加载中…</div>
            </div>
        )  
    }
});
/* Table end */

/**
* page start
*/
var ComPage = React.createClass({
    getDefaultProps: function() {
        return {
            page: 1,
            itemCount: 0,
            navFunc: null,
            pagesize: 20
        };
    },
    pagination:function (target, curPage, itemCount, navFunc, pagesize) {
        var page = lib.loadPage();
        var pg = new page(target, curPage, itemCount, navFunc, pagesize);
        pg.printHtml();
    },
    componentDidUpdate: function() {
        this.pagination('.rp_pg', this.props.page, this.props.itemCount, this.props.onChangPage, this.props.pagesize);
    },    
    render: function() {
        return (
            <div className="rp_pg" style={{textAlign:"right",marginTop:"30px"}}></div>
        );
    }
});
/* page end */


/**
* Tree Table start
*/
component.ComTreeTable = React.createClass({
    getDefaultProps: function() {
        return {
            data: [],
            pkey: '',
            dataurl:'',
            changestatus:null,
            ispage:true,
            defaultparam:null,
            istree:false,
            complete:null
        };
    },
    getInitialState: function() {
        return {
            itemsData: [],
            curpage:1,
            itemCount:0,
            pageSize: 20,
            parameter:this.props.defaultparam
        };
    },
    loadingHide:function() {
        var loaderCircle = ReactDOM.findDOMNode(this.refs.loaderCircle);
        $(loaderCircle).hide();
    },
    setOperation:function() {
        if(this.props.complete){
            this.props.complete(this.state.itemsData);
        }
    },
    getDataList: function (page,arg) {
        arg=arg||null;
        var param={};
        if(arg){
            for (var key in arg) {
                param[key] = arg[key];
            }
        }else if(this.state.parameter){
            for (var key in this.state.parameter) {
                param[key] = this.state.parameter[key];
            }
        }
        if(this.props.ispage){
            param.pageNumber=page;
            param.pageSize=this.state.pageSize;           
        }        

        lib.getJsonData("get", httpurl + this.props.dataurl, param, function (data) {
            data = typeof(data) == "string" ? eval('('+data+')') : data;
            this.setDataList(data,page,param);  
        }.bind(this));
    },
    setDataList: function(data,page,param) {
        if (data.data && data.success && data.stateCode.code == 0) {
            if (this.isMounted()) {
                var fmtData=[];
                this.recurseNode(fmtData,data.data,1);

                var setStateObj={};
                setStateObj.itemsData=fmtData;
                setStateObj.curpage=page;
                setStateObj.itemCount=data.totalCount;
                if(page==1){
                    setStateObj.parameter=param;
                }
                this.setState(setStateObj,function(){});
            }
        }else{
            if (this.isMounted()) {
                this.setState({
                    itemsData: [],
                    curpage:page,
                    itemCount:0,
                    parameter:null
                },function () {});
            }
        }
        this.loadingHide();
    },
    recurseNode: function(fmtData,childrenNode,depth) {
        for(var i=0;i<childrenNode.length;i++){
            var node=childrenNode[i];
            var children=childrenNode[i].children;
            node.children=null;
            node.childrenNum=children.length;
            node.depth=depth;
            fmtData.push(node);
            if(children.length>0){
                this.recurseNode(fmtData,children,depth+1);
            }
        }
    },
    componentDidMount: function() {
        //this.getDataList(1);
        var pagNum=1;
        if(this.state.parameter&&this.state.parameter.pageNumber){
            pagNum=this.state.parameter.pageNumber;
        }
        this.getDataList(pagNum);
        component.signalsObj.search.add(this.getDataList);
    },
    componentWillUnmount: function () {
        component.signalsObj.search.remove(this.getDataList);
    },    
    componentDidUpdate: function() {
        this.setOperation();
    },
    render: function(){
        var datatpl=this.props.data;
        var pkey=this.props.pkey;
        var istreelist=this.props.istree;
        return (
            <div>
                <table className="ui selectable celled table">
                    <thead>
                        <tr>
                        {
                            this.props.data.map(function(item) {
                                return <ItemTh key={item.title} data={item.title}/>;
                            })
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.itemsData.map(function(item) {
                                return <ItemTr key={eval("item."+pkey)} pkey={pkey} data={item} datatpl={datatpl} istree={istreelist}/>;
                            })
                        }
                    </tbody>
                </table>
                {
                    this.props.ispage?<ComPage onChangPage={this.getDataList} page={this.state.curpage} itemCount={this.state.itemCount} pagesize={this.state.pageSize}/>:null
                }
                <div className="ui text active centered inline loader" ref="loaderCircle">加载中…</div>
            </div>
        )  
    }
});
/* ComTreeTable end */

module.exports=component;
