// models.js
// Resources:
// https://aws.amazon.com/blogs/developer/announcing-the-amazon-dynamodb-document-client-in-the-aws-sdk-for-javascript/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/Converter.html

module.exports = {

  user:function (netid, name, photo_url, ideas, comments, timestamp) {
    return {
      TableName: 'User',
      Item: {
        'netid'     : {'S': netid}, // primary key
        'first'     : {'S': name},
        'last'      : {'S': name},
        'photo_url' : {'S': photo_url},
        'timestamp' : {'S' : timestamp},
      }
    }
  },

  idea:function (_id, netid, title, content, photo_url, category,
                 tags, timestamp) {
    return {
      TableName: 'Idea',
      Item: {
        '_id'       : {'S': _id},   // primary key
        'netid'     : {'S': netid}, // secondary key
        'title'     : {'S': title},
        'content'   : {'S': content},
        'photo_url' : {'S': photo_url},
        'tags'      : {'SS': tags},
        'upvotes'   : {'SS': upvotes},
        'downvotes' : {'SS': downvotes},
        'comments'  : {'NS' : comments.map(toString)},
        'timestamp' : {'S' : timestamp},
      }
    }
  },

  comment:function (_id, netid, content, score, comments, timestamp) {
    return {
      TableName: 'Idea',
      Item: {
        '_id'       : {'N': _id},   // primary key
        'idea'      : {'N': idea},  // idea IFF toplevel else NULL
        'netid'     : {'S': netid},
        'content'   : {'S': content},
        'upvotes'   : {'SS': upvotes},
        'downvotes' : {'SS': downvotes},
        'comments'  : {'NS' : comments.map(toString)},
        'timestamp' : {'S' : timestamp},
      }
    }
  },

};
