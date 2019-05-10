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
    let name = "";
    let tagUpdate = [];
    
    
    if(checkedVal === "entreprenuership")
    {
      name = "ent";
    } else if (checkedVal === "club") {
      name = "club";
    } else if (checkedVal === "initiative")
    {
      name = "init";
    } else if (checkedVal === "shower thought")
    {
      name = "shower";
    }

    if(this.state.ent)
      tagUpdate = [...tagUpdate, "entreprenuership"];
    if(this.state.club)
      tagUpdate = [...tagUpdate, "club"];
    if(this.state.init)
      tagUpdate = [...tagUpdate, "initiative"];
    if(this.state.shower)
      tagUpdate = [...tagUpdate, "shower thought"];

    if(tagUpdate.indexOf(checkedVal) !== -1)
    {
      tagUpdate.splice(tagUpdate.indexOf(checkedVal), 1);
    }

    if(e.target.checked)
    {
      tagUpdate = [...tagUpdate, checkedVal];
    }

    this.props.tags(tagUpdate);

    this.setState({ [name]: e.target.checked });
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