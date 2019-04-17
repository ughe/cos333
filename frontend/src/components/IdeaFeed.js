import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IdeaCard from './Card/Card'
import Discussion from './Discussion'


const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '0 auto',
    maxWidth: '120vh',
    paddingTop: '2vh',
  },
});


class IdeaFeed extends React.Component {
  constructor(props) {
    super(props)

    this.handler = this.handler.bind(this)
    this.closer = this.closer.bind(this)

    this.state = {
      list: [],
      discussion: false,
      openIdea: -1,
    }
  }

  
  componentDidMount() {
    fetch('/api/get/idea')
    .then(results => {
      return results.json();
    }).then(data => {

      let random = JSON.stringify(data);
      //let dataArray = this.state.list.splice();
      
      let fetchedData = []
      for(var i = 0; i < data.length; i++)
      {

        let randomIdea = {
        title: data[i]["title"],
        description: data[i]["content"],
        net_votes: data[i]["net_votes"],
        photo_url: data[i]["photo_url"],
        id: data[i]["id"],
        };

        fetchedData = [randomIdea,...fetchedData];

      }


      this.setState({
        list: [
        ...this.state.list,
        ...fetchedData
        ]
      });

    });

  }

  handler(param) {
    this.setState({
      discussion: true,
      openIdea: param,
    });
  }

  closer() {
    this.setState({
      discussion: false,
      openIdea: -1
    });
  }


  render () {
    
    var elements = this.state.list.map((item, index) => <IdeaCard discussion={this.handler} key={index} title={item.title} description={item.description} net_votes={item.net_votes} photo_url={item.photo_url} id={item.id}/>)
    
    if (this.state.discussion)
    {
      return (
        <div>
          <Discussion idea={this.state.openIdea} close={this.closer}/>
        </div>

      );
    } else {
      return (
        <div>
          {elements}
        </div>
      );
    }

    
  }
}

export default IdeaFeed
