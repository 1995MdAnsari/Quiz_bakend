import React,{Component} from "react";
import Axios from "axios";
import Result from "./result";
class MainComponent extends Component{

    state  = {
        questions :[],
        chooseOpt : ["Monkey","Elephant","Cow"],
        personName : {names:''},
        show : 0,
        currIndex: 0,
        errors : 0,
        errorMsg : '',
        arrNew :[],
    }

    async getData(){
        let s = {...this.state};
        let getResponse = await Axios.get('http://localhost:2410/question');
        // let getResponse =  await Axios.get('http://localhost:3003/send/questions');
        let {data} = getResponse;
        let quesdata =[...data];
        s.questions = [...data];
        //this.setState({questions:data});
        console.log(quesdata);
        for(;;)
        {
            if(s.arrNew.length>=5)break;

            let len=quesdata.length;
            let index=Math.floor(Math.random() * len);
            
            let fnd=s.arrNew.find(a=>a===quesdata[index]);
            if(!fnd)
            {
                s.arrNew.push(quesdata[index]);
            }
        }
        // console.log(s.arrNew);
        // console.log(s.questions);
        this.setState(s)
        
    }

    async componentDidMount(){
        this.getData();
    }
    handleChange =(e) =>{
        let s = {...this.state};
        s.personName[e.currentTarget.name] = e.currentTarget.value
        this.setState(s)
    }
    startQuiz = () =>{
        let s = {...this.state};
        if(s.personName.names==='')
        {
            alert("Enter your Name")
        }
        else
        {
            s.show=1;
            s.errorMsg="";
            
        }
        this.setState(s)
    }
    handleAnswer = (num) =>{
        let s = {...this.state};
        // console.log(num);
        if(s.arrNew[s.currIndex].answer===num)
        {
            s.errorMsg='';
            if((s.arrNew.length-1)>s.currIndex)
            {
                s.currIndex++;
            }
            else if((s.arrNew.length-1) === s.currIndex)
            {
                s.show=2;
                s.currIndex=0;
                s.arrNew=[]; 
            }
        }      
        else
        {
            s.errorMsg="Choose correct options";
            s.errors++;
            s.show=1;
        }
        this.setState(s);
    }
    handleTryMore = ()=>{
        let s = {...this.state};
        s.currIndex=0;
        for(;;)
        {
            if(s.arrNew.length>=5)break;
            let len=s.questions.length;
            let index=Math.floor(Math.random() * len);
            
            let fnd=s.arrNew.find(a=>a===s.arrNew[index]);
            if(!fnd)
            {
                s.arrNew.push(s.questions[index]);
            }
        }
        let names = s.personName;
        let currDate = "";
        let currTime = "";
        currDate= new Date().toLocaleDateString();
        currTime = new Date().toLocaleTimeString();
        // sending the result response
        Axios.post('http://localhost:2410/results',
        {name:names,countError:s.errors,date:currDate,time:currTime})
            .then(()=>{
                alert("Result send");
        });
        s.errorMsg='';
        s.errors=0;
        s.show=1;
        this.setState(s)
    }
    showQuestions = () =>{
        let s = {...this.state};
        let arr = s.arrNew[s.currIndex];
        return(
            <React.Fragment>
                <h4>Question Number : {s.currIndex+1}</h4>
                {s.errorMsg==='' ? '' :<h5 className="text-danger">{s.errorMsg}</h5>}
                <img src={arr.image} alt="images" className='img-fluid' 
                    style={{"width":"300px","height":"100%"}} />
                <div className='row col-md-5 col-lg-4 col-sm-4'>
             {s.chooseOpt.map((num)=>{
             return <React.Fragment>
                   <div className='col-md-4 col-lg-4 col-sm-6'>
                          <button className="btn btn-primary btn-sm m-1"
                       onClick={()=>this.handleAnswer(num)}>{num}</button>
                   </div>
            </React.Fragment>
        })}
             </div>
            </React.Fragment>
        )
    }


    render(){
        let {show,personName,errors} = this.state;
        let {names} = personName;
        return(
            <React.Fragment>
                <div className="container m-2">
                {show===0 ? 
                <React.Fragment>
                    <h3>Welcome to the Kids Quiz App</h3><br/>
                    <div className="form-group">
                        <label><b>Enter Your Name</b></label>
                        <input 
                        type="text"
                        className="form-control"  
                        name="names"
                        value={names}
                        placeholder="Enter  Name" 
                        onChange={this.handleChange}/>
                    </div>
                    <button className="btn btn-primary m-2" 
                    onClick={()=>this.startQuiz()}>Start Quiz</button>
                </React.Fragment> : 
                show===1 ? this.showQuestions() : show===2 ? <Result 
                personName={personName} 
                errors={errors} tryMore={this.handleTryMore}/> :''
                }
                </div>
            </React.Fragment>
        )
    }
}

export default MainComponent;