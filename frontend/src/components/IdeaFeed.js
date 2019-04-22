import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IdeaCard from './Card/Card'
import Discussion from './Discussion'

import "../w3.css";
import NewPost from './NewPost';
import SortBar from './SortBar';


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
    this.filter = this.filter.bind(this)

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

  componentWillReceiveProps(nextProps) {
    console.log(nextProps["query"]);
    console.log(JSON.stringify(nextProps).query);
    let request = '/api/get/idea/search/' + nextProps["query"]

    if(nextProps["query"] === '')
    {
      request = '/api/get/idea'
    }

    fetch(request)
    .then(results => {
      return results.json();
    }).then(data => {

      let random = JSON.stringify(data);
      //let dataArray = this.state.list.splice();
      console.log(random);
      
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

      console.log(fetchedData);

      this.setState({
        list: fetchedData
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
      openIdea: -1,
    });
  }

  filter(param){
    this.setState({
      list: param
    });

    console.log(this.state.list);
  }


  render () {
    
    console.log("here");
    console.log(this.state.list);
    console.log(this.state.discussion);

    var elements = this.state.list.map((item, id) => <IdeaCard discussion={this.handler} key={item.id} title={item.title} description={item.description} net_votes={item.net_votes} photo_url={item.photo_url} id={item.id}/>)
    
    return (
      <div>
          <div className="w3-bar">
            <SortBar className="w3-bar-item" filter={this.filter}/>
            <NewPost className="w3-bar-item" />
          </div>
          {elements}
          <Discussion isOpen={this.state.discussion} idea={this.state.openIdea} close={this.closer} refresh={this.handler}/>
      </div>
    );
  }
}

export default IdeaFeed
