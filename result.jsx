import React, { Component } from "react";

class Result extends Component{
    state = {};
    render() {
        let {personName,errors} = this.props;
        let {names} = personName;
        return (
            <React.Fragment>
                <div className="container ">
                    <h2>Check Your Results</h2>
                    <h3>Name: <span className="text-info">{names}</span></h3>
                    <h3>Number of Errors : <span className="text-danger">{errors}</span></h3>
                    <button className="btn btn-warning  m-2"
                     onClick={()=>this.props.tryMore()}>Retry</button>
                </div>
            </React.Fragment>
        )
    }
}
export default Result;