import React from 'react'
import axios from 'axios'
import PHILogo from './assets/PHI.jpg'
import CHALogo from './assets/CHA.jpg'
import ATLLogo from './assets/ATL.jpg'
import BKNLogo from './assets/BKN.jpg'
import BOSLogo from './assets/BOS.jpg'
import CHILogo from './assets/CHI.jpg'
import CLELogo from './assets/CLE.jpg'
import MILLogo from './assets/MIL.jpg'

class BucksTab extends React.Component {
    constructor() {
        super();

        this.state = {
            game: null,
            lastTenWins: 0,
            lastTenLosses: 0,
            visitingLastTenWins: 0,
            visitingLastTenLosses: 0,
            home: true,
            wins: 0,
            losses: 0,
            position: 0,
            gamesBehind: 0
        }
    }

    getImg = (id) => {
        switch (id) {
            case 23:
                return PHILogo;
            case 17:
                return MILLogo;
            case 4:
                return CHALogo;
            case 3:
                return BKNLogo;
            case 1:
                return ATLLogo;
            case 2:
                return BOSLogo;
            case 5:
                return CHILogo;
            case 6:
                return CLELogo;
            default:
                return PHILogo;
        }
    }

    ordinal_suffix_of(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
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
        let result = await axios("https://www.balldontlie.io/api/v1/games?seasons[]=2019&&per_page=100&&team_ids[]=17", {
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


        if (this.state.game.home_team.id === 17) {
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
                if (result.data.data[i].home_team.id === 17 && result.data.data[i].home_team_score > result.data.data[i].visitor_team_score) {
                    this.setState({ lastTenWins: this.state.lastTenWins + 1 });
                }
                else if (result.data.data[i].home_team.id === 17 && result.data.data[i].home_team_score < result.data.data[i].visitor_team_score) {
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
        let otherId = this.state.game.visitor_team.id === 17 ? this.state.game.home_team.id : this.state.game.visitor_team.id;

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

        this.calculateRanking();
    }

    //calculate the rankings of every team so we know where the sixers stand
    async calculateRanking() {
        //first we will calculate the wins and losses for the sixers, and use this to set the games won / lost div

        let result = await axios("https://www.balldontlie.io/api/v1/games?seasons[]=2019&&per_page=100&&team_ids[]=17", {
            headers: {
                Accept: "application/json"
            }
        });

        for (let i = 0; i < result.data.data.length; i++) {
            if (result.data.data[i].status === "Final") {

                //add one to either wins or losses depending
                if (result.data.data[i].home_team.id === 17 && result.data.data[i].home_team_score > result.data.data[i].visitor_team_score) {
                    this.setState({ wins: this.state.wins + 1 });
                }
                else if (result.data.data[i].home_team.id === 17 && result.data.data[i].home_team_score < result.data.data[i].visitor_team_score) {
                    this.setState({ losses: this.state.losses + 1 });
                }
                else if (result.data.data[i].home_team_score > result.data.data[i].visitor_team_score) {
                    this.setState({ losses: this.state.losses + 1 });
                }
                else {
                    this.setState({ wins: this.state.wins + 1 });
                }
            }
        }

        //we will now loop through every team and calculate their number of wins and how many are above the sixers
        let above = 0;
        let maxWins = 0;

        for (let j = 0; j < 32; j++) {
            //continue if its a western conf team or the bucks
            /*if(j === 17 || j === 7 || j === 8 || j === 10 || j === 11 || j === 13 || j === 14 || j === 15 || j === 18 || 
                j === 19 || j === 21 || j === 24 || j === 25 || j === 26 || j === 27 || j === 29){
                continue;
            }*/

            let result = await axios(`https://www.balldontlie.io/api/v1/games?seasons[]=2019&&per_page=100&&team_ids[]=${j}`, {
                headers: {
                    Accept: "application/json"
                }
            });

            let wins = 0;

            for (let i = 0; i < result.data.data.length; i++) {
                if (result.data.data[i].status === "Final") {

                    //add one to wins if they won
                    if (result.data.data[i].home_team.id === j && result.data.data[i].home_team_score > result.data.data[i].visitor_team_score) {
                        wins++;
                    }
                    else if (result.data.data[i].visitor_team.id === j && result.data.data[i].home_team_score < result.data.data[i].visitor_team_score) {
                        wins++;
                    }

                    if (j == 1) {
                        console.log(result.data.data[i].home_team.id + "  " + result.data.data[i].home_team.abbreviation);
                    }
                }
            }

            if (wins > this.state.wins) {
                above++;
            }

            if (wins > maxWins) {
                maxWins = wins;
            }
        }

        this.setState({ position: above + 1, gamesBehind: this.state.wins - maxWins });
    }

    render() {
        return (this.state.game ? <div className="bucks-basketball-div">
            {this.state.home ?
                <div className='logo-container'>
                    <center className='ranking'>{this.ordinal_suffix_of(this.state.position)} ({this.state.gamesBehind})</center>
                    <img className="home-logo" src={MILLogo} />
                    <center className="last-ten">({this.state.lastTenWins}-{this.state.lastTenLosses})</center>
                </div>
                :
                <div className='logo-container'>
                    <center className='ranking'>Bad</center>
                    <img className="home-logo" src={this.getImg(this.state.game.home_team.id)} />
                    <center className="last-ten">({this.state.visitingLastTenWins}-{this.state.visitingLastTenLosses})</center>
                </div>
            }
            <div>
                <center className="season-wins">{this.state.wins}-{this.state.losses}</center>
                <center className="score">12{this.state.game.home_team_score}-10{this.state.game.visitor_team_score
                }</center>
                <div>
                    <center className="date-vs">
                        vs<br />
                        {this.dateFactory(this.state.game.date.slice(5, 10))}
                        <br></br>
                        {this.state.game.status}
                    </center></div>
            </div>
            {!this.state.home ?
                <div className='logo-container'>
                    <center className='ranking'>{this.ordinal_suffix_of(this.state.position)} ({this.state.gamesBehind})</center>
                    <img className="home-logo" src={MILLogo} />
                    <center className="last-ten">({this.state.lastTenWins}-{this.state.lastTenLosses})</center>
                </div>
                :
                <div className='logo-container'>
                    <center className='ranking'>Bad</center>
                    <img className="home-logo" src={this.getImg(this.state.game.visitor_team.id)} />
                    <center className="last-ten">({this.state.visitingLastTenWins}-{this.state.visitingLastTenLosses})</center>
                </div>
            }

        </div> : <div></div>);
    }
}

export default BucksTab;