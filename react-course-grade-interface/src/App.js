import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator'
import './App.css';
import AsgnTable from './AsgnTable'
import GradeService from './GradeService'

const colWidth = { 
  width: '25%'
}

class App extends Component {
  constructor() {
    super();

    this.state ={
      asgnItems: [],  
      name: '',
      weight: '',
      grade: '',
      showGradeMessage: false,
      gradesNormalized: false,
      letterGrade: '',
    };
    
    this.setName = this.setName.bind(this);
    this.setWeight = this.setWeight.bind(this);
    this.setGrade = this.setGrade.bind(this);
    
    this.addAssignment = this.addAssignment.bind(this);
    this.deleteAssignment = this.deleteAssignment.bind(this);
    this.sendToRecords = this.sendToRecords.bind(this);

  }

  componentWillMount() {
    this.validator = new SimpleReactValidator({
      element: 
      (message) => <div className='text-danger'>{message}</div>,
    })
  }

  setName(e) {
    this.setState({name: e.target.value});
  }
  setWeight(e) {
    this.setState({weight: e.target.value});
  }
  setGrade(e) {
    this.setState({grade: e.target.value});
  }
 
  addAssignment(e) {
    this.setState({showGradeMessage: false});

    if( this.validator.allValid() ){
      let inputItem = {name: this.state.name, weight: this.state.weight, grade: this.state.grade};
      let tempAssignList = this.state.asgnItems;
      tempAssignList.push(inputItem);
      this.setState({"asgnItems":tempAssignList});
      // clear the input boxes
      this.setState({"name":''});
      this.setState({"weight":''});
      this.setState({"grade":''});
      // clear the validator messages until the next submit
      this.validator.hideMessages();
    } 
    else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      this.forceUpdate();
    }
  }

  deleteAssignment(index) {
    this.setState({showGradeMessage: false});

    let tempAssignList = this.state.asgnItems;
    tempAssignList.splice(index, 1);
    this.setState({"asgnItems":tempAssignList});
  }

  sendToRecords() {
    if(GradeService.isNormalized(this.state.asgnItems)) {
      this.setState({gradesNormalized: true});
    }
    else {
      this.setState({gradesNormalized: false});
    }
    this.setState({letterGrade: GradeService.calcLetterGrade(this.state.asgnItems)});

    this.setState({showGradeMessage: true});
  }

  render() {
    return  (
      <div>

        <table className='table'>
          <tbody>
          <tr>
            <th style={colWidth}></th>
            <th style={colWidth}>Assignment</th> 
            <th style={colWidth}>Weight</th>
            <th style={colWidth}>Grade out of 100</th>
          </tr>
            <tr>
                <td>
                  <input type='button' onClick={this.addAssignment} value="Add New Assignment" />
                </td>

                <td>
                  <input type='text' value={this.state.name} onChange={this.setName} />
                  {this.validator.message('name', this.state.name, 'required')}
                </td>

                <td>
                  <input type='text' value={this.state.weight} onChange={this.setWeight} />
                  {this.validator.message('weight', this.state.weight, 'required|numeric|min:0,num|max:100,num')}
                </td>

                <td>
                  <input type='text' value={this.state.grade} onChange={this.setGrade} />
                  {this.validator.message('grade', this.state.grade, 'required|numeric|min:0,num|max:100,num')}
                </td>            
            </tr>
          </tbody>  
        </table> 
  
        <AsgnTable asgnItems={this.state.asgnItems} deleteAssignment={this.deleteAssignment}/>
        
        <table className='table'>
          <tbody>
          <tr>
            <td style={colWidth}>
              <input type='button' onClick={this.sendToRecords} value="Send to Student Records" />
            </td>
            <td >
              {this.state.showGradeMessage
              ?<span>
                {this.state.gradesNormalized
                ?<span className='text-allgood'>
                  The final grade is {this.state.letterGrade}. Grades have been sent.
                </span>
                :<span className='text-danger'>
                  * Weights must add up to 100.
                </span>
                }
              </span>
              :<span></span>
              }
            </td> 
          </tr>
          </tbody>  
        </table> 

        
      </div>
    ); 
  }
}
export default App;

