import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Record extends React.Component {
  constructor(props) {
    super(props);
    this.isdoChange = this.isdoChange.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.delete = this.delete.bind(this);
    this.notice = this.notice.bind(this);
    // this.last_value = "";
  }

  isdoChange(e) {
    this.props.isDo(this.props.index);
  }
  
  valueChange(e) {
    console.log(e.target, this.props.index);
    this.props.valueChange(e.target.value, this.props.index)
  }

  delete(e) {
    this.props.delete(this.props.index);
  }

  /*失去焦点时触发的事件，删除记录 */
  notice(e) {
    if (e.target.value === "") {
      this.delete(this.props.index);
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.adata.isdo ? 
          <p className="time">
            <span>类别：
              {this.props.adata.classify === "living" ? "生活" 
              : this.props.adata.classify === "study" ? "学习"
              : "工作"  
              }&nbsp;&nbsp;
            </span>
            <span>制定时间为:</span>
            {this.props.adata.date}
            &nbsp;&nbsp;---&nbsp;&nbsp;
            <span>完成时间为:</span>
            {this.props.adata.time_exact}
          </p>
          :
          <p className="time">
            <span>类别：
              {this.props.adata.classify === "living" ? "生活" 
              : this.props.adata.classify === "study" ? "学习"
              : "工作"  
              }&nbsp;&nbsp;
            </span>
            <span>制定时间为:</span>
            {this.props.adata.date}
          </p>
        }
        
        <div className="content">
          <input
              type="checkbox"
              checked={this.props.adata.isdo}
              className="isdo"
              onChange={this.isdoChange}/>
            {/** 根据里面是否有内容决定标签类型，没有做的为textarea可修改，已经做的为p标签不可修改 */}
            {this.props.adata.isdo ? 
                <p
                className="text"
                >
                  {this.props.adata.value}
                </p>
                :
                <input
                type="text"
                maxLength="100"
                value={this.props.adata.value}
                className="text"
                onChange={this.valueChange}
                onBlur={this.notice}
                />
            }    
            <input
              type="button"
              value="delete"
              className="delete"
              onClick={this.delete}/>
        </div>
      </React.Fragment>
    );
  }
}

class RecordAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "value": "",
      "date": "",
      "classify": "living"
    }
    this.dateChange = this.dateChange.bind(this);
    this.textChange = this.textChange.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.classifyChange = this.classifyChange.bind(this);
  }

  classifyChange(e){
    console.log(e.target.value);
    const classify = e.target.value;
    this.setState({
      "classify": classify
    })
  }

  addRecord(e) {
    console.log(this.props.alldata);
    const value = this.state.value;
    if (value === ""){
      alert("计划内容不可以为空哦！")
    } else {
      const time = new Date();
      const date = this.state.date;
      const classify = this.state.classify;
      const date_exact = "  " + 
                    ("0" + time.getHours()).slice(-2) + ":" +
                    ("0" + time.getMinutes()).slice(-2) + ":" +
                    ("0" + time.getSeconds()).slice(-2);
      const data = {
        "classify": classify,
        "isdo": false,
        "value": value,
        "date": date + date_exact,
      }
      this.setState({
        "value": ""
      })
      this.props.addRecord(data);
    }
  }

  /* 渲染时更新时间为当天 */
  componentDidMount(){
    const time = new Date();
    this.setState({
      "date": time.getFullYear() + "-" +
              ("0" + (time.getMonth() + 1)).slice(-2) + "-" +
              ("0" + time.getDate()).slice(-2)
    });
  };

  /* 文本框内的内容 */
  textChange(e) {
    const value = e.target.value;
    this.setState({
      "value": value
    })
    console.log(value);
  }

  /* 调整时间 */
  dateChange(e){
    const time = e.target.value;
    this.setState({
      "date": time
    });
    console.log(e.target.value)
  }

  render() {
    return (
      <div className="add_list">
        <input
          type="date"
          value={this.state.date}
          onChange={this.dateChange}/>
        <select onChange={this.classifyChange}>
          <option value="living">生活</option>
          <option value="study">学习</option>
          <option value="work">工作</option>
        </select>
        <input 
          type="text"
          placeholder="制定你的计划......"
          onChange={this.textChange}
          value={this.state.value}/>
        <input
          type="button" 
          value="add a record"
          className="add"
          onClick={this.addRecord}/>
      </div>
    )
  }
}

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "alldata": [],
      "classify": "",
    };
    this.valueChange = this.valueChange.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.delete = this.delete.bind(this);
    this.isDo = this.isDo.bind(this);
    this.classifyChange = this.classifyChange.bind(this);
  }

  /** 渲染后进行 */
  componentDidMount() {
    let alldata = localStorage.getItem("alldata") === null 
    ? [] : JSON.parse(localStorage.getItem("alldata"));
    console.log("打开时渲染：", alldata);
    this.setState({
      "alldata": alldata
    });
  }

  /* 更新localStorage 的内容 */
  updataAlldata() {
    const alldata = this.state.alldata;
    this.setState({
      "alldata": alldata
    });
    localStorage.removeItem("alldata");
    localStorage.setItem("alldata", JSON.stringify(alldata));
  }

  /* 改变备忘录中的记录的任何内容时更新时间 */
  timeChange(index, isdo){
    const alldata = this.state.alldata;
    const time = new Date();
    const time_exact = time.getFullYear() + "-" +
                      ("0" + (time.getMonth() + 1)).slice(-2) + "-" +
                      ("0" + time.getDate()).slice(-2) + "  " + 
                      ("0" + time.getHours()).slice(-2) + ":" +
                      ("0" + time.getMinutes()).slice(-2) + ":" +
                      ("0" + time.getSeconds()).slice(-2);  
    if (isdo) {
      alldata[index].time_exact = time_exact;
    } else {
      alldata[index].date = time_exact;
    }
  }

  /* 点击后添加 */
  addRecord(data) {
    console.log("Add a record");
    const alldata = this.state.alldata;
    alldata.push(data);
    this.updataAlldata();
  }

  valueChange(value, index) {
    console.log(value, index);
    const alldata = this.state.alldata;
    if(value === alldata[index].value) {
      console.log("没有修改，不用更改时间")
    } else {
      alldata[index].value = value;
      this.timeChange(index);
      this.updataAlldata();
    }
  }

  /* 改变isdo，改变后如果为true，则修改“制定时间”；如果为false，则修改完成时间 */
  isDo(index) {
    const alldata = this.state.alldata;
    alldata[index].isdo = !alldata[index].isdo;
    console.log(index + "现在是：" + alldata[index].isdo)
    if (alldata[index].isdo) {
      this.timeChange(index, alldata[index].isdo);
    } else {
      this.timeChange(index, alldata[index].isdo);
    }
    this.updataAlldata();
  }

  /* 删除记录 */
  delete(index) {
    console.log("Delete a record");
    const alldata = this.state.alldata;
    alldata.splice(index, 1);
    this.updataAlldata();
  }

  classifyChange(e) {
    console.log(e);
    this.setState({
      "classify": e,
    });
  }

  render() {
    const alldata = this.state.alldata;
    const classify = this.state.classify;
    console.log(classify);
    return (
      <div>
        {/* 导航栏，点击后会切换黑底白字，以及分类切换 */}
        <div className="chooses">
        <span
          className={classify === "" ? "items activity" : "items"} 
          onClick={this.classifyChange.bind(this, "")}>
            全部
        </span>
        <span
          className={classify === "living" ? "items activity" : "items"} 
          onClick={this.classifyChange.bind(this, "living")}>
            生活
        </span>
        <span
          className={classify === "study" ? "items activity" : "items"} 
          onClick={this.classifyChange.bind(this, "study")}>
            学习
        </span>
        <span
          className={classify === "work" ? "items activity" : "items"} 
          onClick={this.classifyChange.bind(this, "work")}>
            工作
        </span>
        </div>
        {/* 点击添加 */}
        <RecordAdd
          alldata={this.state.alldata}
          addRecord={this.addRecord}/>
        <hr></hr>
        {/* 未做过的 */}
        <div>
          <p className="title">还没有做的事情：</p>
          {alldata.map((item, index) => {
            if (classify === "") {
              if (!item.isdo) {
                return (
                <div key={index}>
                  <Record
                    index={index}
                    adata={item}
                    valueChange={this.valueChange}
                    delete={this.delete}
                    isDo={this.isDo}/>
                </div>)
              }
            } else {
              if (!item.isdo) {
                if (classify === item.classify){
                  return (<div key={index}>
                      <Record
                        index={index}
                        adata={item}
                        valueChange={this.valueChange}
                        delete={this.delete}
                        isDo={this.isDo}/>
                    </div>)
                }
              }
            }
            return "";
          })}
          
        </div>
        <hr></hr>
        {/* 已经做了 */}
        <div>
          <p className="title">已经做了的事情：</p>
          {alldata.map((item, index) => {
            if (classify === "") {
              if(item.isdo) {
                return (<div key={index}>
                  <Record
                    index={index}
                    adata={item}
                    valueChange={this.valueChange}
                    delete={this.delete}
                    isDo={this.isDo}/>
                </div> )
              }
            } else {
              if(item.isdo) {
                if (classify === item.classify) {
                  return (<div key={index}>
                    <Record
                      index={index}
                      adata={item}
                      valueChange={this.valueChange}
                      delete={this.delete}
                      isDo={this.isDo}/>
                  </div> )
                }
              }
            }
            return "";
            })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ToDoList />,
  document.getElementById("root")
)