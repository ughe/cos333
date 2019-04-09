import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IdeaCard from './Card/Card'

const sampleData = {"Item": {
        '_id'       : {'S': "0"},
        'netid'     : {'S': "aboppana"},
        'title'     : {'S': "Database Title"},
        'content'   : {'S': "This is a description. This is a description from the database"},
        'photo_url' : {'S': "blank"},
        'category'  : {'S': "Entreprenuership"},
        'comments'  : {'SS' : ["a", "b"]},
        'score'     : {'S': '3'},
        'timestamp' : {'S' : "avi"},
      }
};

let titles = sampleData["Item"]["title"]["S"];
let descriptions = sampleData["Item"]["content"]["S"];
let scores = sampleData["Item"]["score"]["S"];


const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '0 auto',
    maxWidth: '120vh',
    paddingTop: '2vh',
  },
});

const experiment = () => {
      return <div>
        <IdeaCard title = "Hemp Roads" description = {"Hemp-based road paving is an environmentally-friendly" 
          + " and cost-effective technology that has not yet been implemented in the US market."} score = "55" 
          url = "http://extras.mnginteractive.com/live/media/site19/2018/0522/20180522__23ST_road_work~1.jpg" />

      </div>
      }


class IdeaFeed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          title: "Hemp Roads",
          description: "Hemp-based road paving is an environmentally-friendly and cost-effective technology that has not yet been implemented in the US market." ,
          score: 55,
          url: "http://extras.mnginteractive.com/live/media/site19/2018/0522/20180522__23ST_road_work~1.jpg",
        },

        {
          title: "Hemp Roads",
          description: "Hemp-based road paving is an environmentally-friendly and cost-effective technology that has not yet been implemented in the US market." ,
          score: 55,
          url: "http://extras.mnginteractive.com/live/media/site19/2018/0522/20180522__23ST_road_work~1.jpg",
        },
      ]
    }
  }

  render () {

    var elements = this.state.list.map(item => <IdeaCard title={item.title} description={item.description} score={item.score} url={item.url} />)

    return (
      <div>
        {elements}
      </div>

    )
  }
}

export default IdeaFeed

//function FormRow(props) {
  /*const { classes } = props;*/
/*
  return (
    <React.Fragment>
      <Grid item xs={4}>
        <IdeaCard title={titles} description = {descriptions} score = {scores} />
      </Grid>
      <Grid item xs={4}>
        <IdeaCard title ="like"/>
      </Grid>
      <Grid item xs={4}>
        <IdeaCard />
      </Grid>
    </React.Fragment>
  );
}

FormRow.propTypes = {
  classes: PropTypes.object.isRequired,
};

function NestedGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid container item xs={12} spacing={24}>
          <FormRow classes={classes} />
        </Grid>
      </Grid>
    </div>
  );
}

NestedGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};
*/

//export default withStyles(styles)(NestedGrid);