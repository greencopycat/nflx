import React, { Component } from 'react';
import './App.css';

/* My List */
class VideoList extends Component {
  label = "My List";
  constructor(props) {
    super(props)
    this.state = {
      hander: this.props.handleEvent
    }

    this.removeVideo = this.removeVideo.bind(this);
  }

  render() {
    return (
      <div className="filmstrip">
        <label htmlFor="mylist">{this.label}</label>
        <ul className="mylist">
          {
            this.props.videos.map((item)=>(
              <li key={item.id}>
                <div className="item-image">
                  <img src={item.img} alt={item.title} />
                  <span className="itemLabel">{item.title}</span>
                </div>
                <button onClick={this.removeVideo} itemindex={item.id} className="btn btn-remove" aria-label="Remove Item From My List">Remove</button>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
  removeVideo ($event) {
    this.state.hander(Number.parseInt($event.target.attributes.itemindex.value))
  }
}


/* Recommendations */
class Recommendations extends Component {
  label = "Recommendations";
  constructor (props) {
    super (props)
    this.state = {
      handler: this.props.handleEvent
    }
    this.addVideo = this.addVideo.bind(this);
  }
  render() {
    return (
      <div className="filmstrip">
        <label htmlFor="recommendations">{this.label}</label>
        <ul className="recommendations">
          {
            this.props.items.map((item)=>(
              <li key={item.id}>
                <div className="item-image">
                  <img src={item.img} alt={item.title} />
                  <span className="itemLabel">{item.title}</span>
                </div>
                <button onClick={this.addVideo} className="btn btn-add" itemindex={item.id} aria-label="Add Item to My List">Add</button>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }

  addVideo($event) {
    this.state.handler(Number.parseInt($event.target.attributes.itemindex.value));
  }
}

/* Application */
class App extends Component {
  // currently using mock ws server, need to be replace for production
  ws = "http://localhost:3000/nflx";
  constructor (props) {
    super(props);
    this.state = {
      recommendations: [],
      mylist: []
    }
    this.moveItem = this.moveItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  /* Get JSON file */
  componentDidMount() {
    fetch(this.ws)
    .then(result => result.json())
    .then(result => {
      this.setState({
        recommendations: result.recommendations,
        mylist: result.mylist
      });
    }, (err) => {
      if(err) {
        console.error(err);
      }
    })
  }

  moveItem(id) {
    const item = this.state.recommendations.filter(item=>item.id === id);
    const newlist = this.state.recommendations.filter(item=>item.id !== id);
    let newArray = this.state.mylist.slice();
    newArray.push(item[0]);
    this.setState({
      recommendations: newlist,
      mylist: newArray
    })
  }


  removeItem(id) {
    /* use filter to get match item, or we can use map, and process data within the callback */
    const newArray = this.state.mylist.filter(item=>item.id !== id);
    const item = this.state.mylist.filter(item=>item.id === id);
    let newRecommendation = this.state.recommendations.slice();
    newRecommendation.push(item[0]);
    this.setState({
      mylist: newArray,
      recommendations: newRecommendation
    })
  }

  render() {
    return (
      <div className="App">
        <section>
          <VideoList handleEvent={this.removeItem} videos={this.state.mylist} />
          <Recommendations handleEvent={this.moveItem} items={this.state.recommendations} />
        </section>
        <ul>
          {
            this.state.mylist.map(item=>
              <li key={item.id}>{item.title}</li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default App;
