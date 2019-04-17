import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Checkboxes extends React.Component {
  
  constructor(props){
    super(props);
    this.handleChecks = this.handleChecks.bind(this)
    this.state = {
      ent: false,
      club: false,
      init: false,
      shower: false,
    }
  }
  
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChecks = (checkedVal) => (e) => {
    this.props.tags(checkedVal);
  }

  render() {
    return (
      <div>
      
        <FormControlLabel
          control={
            <Checkbox
              name="ent"
              value="entreprenuership"
              onChange={this.handleChecks('entreprenuership')}
            />
          }
          label="Entreprenuership"/>

        <FormControlLabel
          control={
            <Checkbox
              name="club"
              value="club"
              onChange={this.handleChecks('club')}
            />
          }
          label="Clubs"/>

        <FormControlLabel
          control={
            <Checkbox
              name="init"
              value="initiative"
              onChange={this.handleChecks('initiative')}
            />
          }
          label="Initiatives"/>

        <FormControlLabel
          control={
            <Checkbox
              name="shower"
              value="shower thought"
              onChange={this.handleChecks('shower thought')}
            />
          }
          label="Shower Thoughts"/>


      </div>
    );
  }
}

export default Checkboxes;