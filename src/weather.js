import React from 'react'
import apiImport from './apiKeys'

class Weather extends React.Component{
    
  constructor() {
    super();
    this.state = {
      api: apiImport,
      query: '',
      weather: {}
    }
  }

  dateFactory = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${month} ${date}, ${year}`
  }

  //component did mount equivalent
  async componentDidMount() {
    fetch(`${this.state.api.base}weather?q=Philadelphia&units=imperial&APPID=${this.state.api.key}`)
      .then(res => res.json())
      .then(result => {
        this.setState({ weather: result, query: '' });
      });
  }

  render() {
    return (
      <div className="grid-container" >
        <div className="weather-box">
          <div className={(typeof this.state.weather.main != "undefined") ? ((this.state.weather.main.temp > 65) ? 'app warm' : 'App') : 'App'}>
            <main>
              <div className="search-box">
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search..."
                  onChange={e => this.setState({ query: e.target.value })}
                  value={this.state.query}
                  onKeyPress={this.getWeather} />
              </div>
              {(typeof this.state.weather.main == "undefined") ? ('') :
                <div>
                  <div className="location-box">
                    <div className="location">{this.state.weather.name}, {this.state.weather.sys.country}</div>
                    <div className="date">{this.dateFactory(new Date())}</div>
                  </div>
                  <div>
                    <div>

                      <div className="weather-box">
                        <div className="temperature">
                          {Math.round(this.state.weather.main.temp)}°F
                        </div>
                      </div>
                    </div>
                    <div className="weather">{this.state.weather.weather[0].main}</div>
                    <div className="mini-weather-box">
                      <div className="mini-temperature">
                        {Math.round(this.state.weather.main.temp_min)}°F
                      </div>
                      <div className="mini-temperature">
                        {Math.round(this.state.weather.main.temp_max)}°F
                      </div>
                    </div>
                  </div>
                </div>
              }
            </main>
          </div>
        </div>
      </div>
    );
  }

  //get he weather from the API
  getWeather = evt => {
    if (evt.key === "Enter") {
      fetch(`${this.state.api.base}weather?q=${this.state.query}&units=imperial&APPID=${this.state.api.key}`)
        .then(res => res.json())
        .then(result => {
          this.setState({ weather: result, query: '' });
        });
    }

  }

}

export default Weather;