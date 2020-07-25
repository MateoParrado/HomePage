import React from 'react'
import axios from 'axios'
import PHILogo from './assets/PHI.jpg'
import CHALogo from './assets/CHA.jpg'

class SixersTab extends React.Component {
    constructor() {
        super();

        this.state = {
            game: null,
            lastTenWins: 0,
            lastTenLosses: 0,
            visitingLastTenWins: 0,
            visitingLastTenLosses: 0,
            home: true
        }
    }

    getImg = (id) => {
        switch (id) {
            case 23:
                return PHILogo;
            case 4:
                return CHALogo;
            default:
                return PHILogo;
        }
    }

    dateFactory = (str) => {
        let d = new Date(2020, str.slice(0, 2), str.slice(3, 5));

        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day}, ${month} ${date}`
    }

    async componentDidMount() {
        let result = await axios("https://www.balldontlie.io/api/v1/games?seasons[]=2019&&per_page=100&&team_ids[]=23", {
            headers: {
                Accept: "application/json"
            }
        });

        //sort it by closeness to today
        result.data.data.sort(function (a, b) {

            var distancea = Math.abs(new Date() - new Date(a.date));
            var distanceb = Math.abs(new Date() - new Date(b.date));
            return distancea - distanceb; // sort a before b when the distance is smaller
        });

        //set the game to the closest game to today
        await this.setState({ game: result.data.data[0] });


        if (this.state.game.home_team.id === 23) {
            this.setState({ home: true });
        }
        else {
            this.setState({ home: false });
        }

        //now loop through and find the closest ten completed games, and update the last ten wins / losses
        let i = 0;
        let done = 0;
        for (i; i < result.data.data.length; i++) {
            if (result.data.data[i].status === "Final") {
                done++;

                //add one to either wins or losses depending
                if (result.data.data[i].home_team.id === 23 && result.data.data[i].home_team_score > result.data.data[i].visitor_team_score) {
                    this.setState({ lastTenWins: this.state.lastTenWins + 1 });
                }
                else if (result.data.data[i].home_team.id === 23 && result.data.data[i].home_team_score < result.data.data[i].visitor_team_score) {
                    this.setState({ lastTenLosses: this.state.lastTenLosses + 1 });
                }
                else if (result.data.data[i].home_team_score > result.data.data[i].visitor_team_score) {
                    this.setState({ lastTenLosses: this.state.lastTenLosses + 1 });
                }
                else {
                    this.setState({ lastTenWins: this.state.lastTenWins + 1 });
                }

                if (done === 10) {
                    break;
                }

            }

        }
        //do the same for the visitor
        console.log(this.state.game);

        let otherId = this.state.game.visitor_team.id === 23 ? this.state.game.home_team.id : this.state.game.visitor_team.id;

        result = await axios(`https://www.balldontlie.io/api/v1/games?seasons[]=2019&&per_page=100&&team_ids[]=${otherId}`, {
            headers: {
                Accept: "application/json"
            }
        });

        //sort it by closeness to today
        result.data.data.sort(function (a, b) {

            var distancea = Math.abs(new Date() - new Date(a.date));
            var distanceb = Math.abs(new Date() - new Date(b.date));
            return distancea - distanceb; // sort a before b when the distance is smaller
        });

        i = 0;
        done = 0;
        for (i; i < result.data.data.length; i++) {
            if (result.data.data[i].status === "Final") {
                done++;

                //add one to either wins or losses depending
                if (result.data.data[i].home_team.id === otherId && result.data.data[i].home_team_score > result.data.data[i].visitor_team_score) {
                    this.setState({ visitingLastTenWins: this.state.visitingLastTenWins + 1 });
                }
                else if (result.data.data[i].home_team.id === otherId && result.data.data[i].home_team_score < result.data.data[i].visitor_team_score) {
                    this.setState({ visitingLastTenLosses: this.state.visitingLastTenLosses + 1 });
                }
                else if (result.data.data[i].home_team_score > result.data.data[i].visitor_team_score) {
                    this.setState({ visitingLastTenLosses: this.state.visitingLastTenLosses + 1 });
                }
                else {
                    this.setState({ visitingLastTenWins: this.state.visitingLastTenWins + 1 });
                }

                if (done === 10) {
                    break;
                }
            }
        }

    }

    render() {
        return (this.state.game ? <div className="basketball-div">
            {this.state.home ?
                <div className='logo-container'>
                    <div className='ranking'>1st (-0)</div>
                    <img className="home-logo" src={PHILogo} />
                    <div className="last-ten">({this.state.lastTenWins}-{this.state.lastTenLosses})</div>
                </div>
                :
                <div className='logo-container'>
                    <div className='ranking'>1st (-0)</div>
                    <img className="home-logo" src={this.getImg(this.state.game.home_team.id)} />
                    <div className="last-ten">({this.state.visitingLastTenWins}-{this.state.visitingLastTenLosses})</div>
                </div>
            }
            <div>
                <center>39-26</center>
                <center className="score">{this.state.game.home_team_score}-{this.state.game.visitor_team_score
                }</center>
                <div>
                    <center className="date-vs">
                        vs<br />
                        {this.dateFactory(this.state.game.date.slice(5, 10))}
                    </center></div>
            </div>
            {!this.state.home ?
                <div className='logo-container'>
                    <div className='ranking'>1st (-0)</div>
                    <img className="home-logo" src={PHILogo} />
                    <div className="last-ten">({this.state.lastTenWins}-{this.state.lastTenLosses})</div>
                </div>
                :
                <div className='logo-container'>
                    <div className='ranking'>1st (-0)</div>
                    <img className="home-logo" src={this.getImg(this.state.game.visitor_team.id)} />
                    <div className="last-ten">({this.state.visitingLastTenWins}-{this.state.visitingLastTenLosses})</div>
                </div>
            }

        </div> : <div></div>);
    }
}

export default SixersTab;