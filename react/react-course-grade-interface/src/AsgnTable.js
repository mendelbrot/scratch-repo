import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator'

const colWidth = { 
    width: '25%'
}

const underline = { 
    textDecoration: 'underline'
}

class AsgnTable extends Component {
    constructor(props) {
        super(props);


    }

    render() {
        return(
            
        <table className='table'>
          <tbody>
          <tr>
            <th style={colWidth}></th>
             <th style={colWidth}>Assignment</th>  
            <th style={colWidth}>Weight</th>
            <th style={colWidth}>Grade out of 100</th>
          </tr>
            {this.props.asgnItems.map((asgn, index) => (

            <tr key={index}>
                <th onClick={() => this.props.deleteAssignment(index)} style={underline}>delete</th>
                <td>{asgn.name}</td>
                <td>{asgn.weight}</td>
                <td>{asgn.grade}</td>            
            </tr>
            ))} 
          </tbody>  
        </table> 
        );
    }
}
export default AsgnTable;