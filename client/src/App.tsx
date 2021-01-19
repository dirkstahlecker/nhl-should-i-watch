import React from 'react';
import './App.css';
import Cookies from 'js-cookie';
import {observer} from "mobx-react";
import {makeObservable, observable, runInAction, action} from "mobx";
import { teams } from './teams';

export class AppMachine
{
  public DEFAULT_MARGIN: string = "1";
  public DEFAULT_PERCENTAGE = "10";
  public DEFAULT_WIN_DIFF = ""

  @observable public error: any = null;
  @observable public worthWatching: boolean | null = null;
  @observable public selectedTeam: number = teams.BRUINS;
  @observable public margin: string | null = this.DEFAULT_MARGIN;
  @observable public percentage: string | null = this.DEFAULT_PERCENTAGE;
  @observable public maxWinDifferential: string | null = this.DEFAULT_WIN_DIFF;
  @observable public date: string = ""; //TODO

  LOCAL = false;

  constructor()
  {
    makeObservable(this);
  }
}

export interface AppProps
{
  machine: AppMachine;
}

@observer
class App extends React.Component<AppProps>
{
  private get machine(): AppMachine
  {
    return this.props.machine;
  }

  setInitialSelectedTeam = async () => {
    const selectedCookie = Cookies.get("initialSelectedTeam");
    if (selectedCookie != null)
    {
      this.machine.selectedTeam = Number.parseInt(selectedCookie);
      return selectedCookie;
    }

    const locationUrl = "http:\//ip-api.com/json/?fields=status,message,countryCode,region,regionName,city,query";
    const locationDataRaw = await fetch(locationUrl); //, {mode: "no-cors"}
    const locationData = await locationDataRaw.json();

    console.log("Location data region: " + locationData.region);

    if (locationData.status === "fail")
    {
      return; //use defaults
    }

    let initialSelectedTeam = teams.BRUINS //TODO

    //https://ip-api.com/docs/api:json#test

    switch (locationData.region)
    {
      case "AL":
        initialSelectedTeam = teams.PREDATORS;
        break;
      case "AK":
        initialSelectedTeam = teams.CANUCKS;
        break;
      case "AZ":
        initialSelectedTeam = teams.COYOTES;
        break;
      case "AR":
        initialSelectedTeam = teams.STARS;
        break;
      case "CA":
        //TODO
        initialSelectedTeam = teams.KINGS;
        break;
      case "CO":
        initialSelectedTeam = teams.AVALANCHE;
        break;
      case "CT":
        initialSelectedTeam = teams.BRUINS;
        break;
      case "DE":
        initialSelectedTeam = teams.FLYERS;
        break;
      case "FL":
        initialSelectedTeam = teams.PANTHERS;
        //TODO
        break;
      case "GA":
        initialSelectedTeam = teams.LIGHTNING;
        break;
      case "HI":
        initialSelectedTeam = teams.SHARKS;
        break;
      case "ID":
        initialSelectedTeam = teams.AVALANCHE;
        break;
      case "IL":
        initialSelectedTeam = teams.BLACKHAWKS;
        break;
      case "IN":
        initialSelectedTeam = teams.BLACKHAWKS;
        break;
      case "IA":
        initialSelectedTeam = teams.WILD;
        break;
      case "KS":
        initialSelectedTeam = teams.AVALANCHE;
        break;
      case "KY":
        initialSelectedTeam = teams.PREDATORS;
        break;
      case "LA":
        initialSelectedTeam = teams.STARS;
        break;
      case "ME":
        initialSelectedTeam = teams.BRUINS;
        break;
      case "MD":
        initialSelectedTeam = teams.CAPITALS;
        break;
      case "MA":
        initialSelectedTeam = teams.BRUINS;
        break;
      case "MI":
        initialSelectedTeam = teams.REDWINGS;
        break;
      case "MN":
        initialSelectedTeam = teams.WILD;
        break;
      case "MS":
        initialSelectedTeam = teams.PREDATORS;
        break;
      case "MO":
        initialSelectedTeam = teams.BLUES;
        break;
      case "MT":
        initialSelectedTeam = teams.FLAMES;
        break;
      case "NE":
        initialSelectedTeam = teams.AVALANCHE;
        break;
      case "NV":
        initialSelectedTeam = teams.KNIGHTS;
        break;
      case "NH":
        initialSelectedTeam = teams.BRUINS;
        break;
      case "NJ":
        initialSelectedTeam = teams.DEVILS;
        break;
      case "NM":
        initialSelectedTeam = teams.COYOTES;
        break;
      case "NY":
        initialSelectedTeam = teams.RANGERS; //TODO:
        break;
      case "NC":
        initialSelectedTeam = teams.HURRICANES;
        break;
      case "ND":
        initialSelectedTeam = teams.JETS;
        break;
      case "OH":
        initialSelectedTeam = teams.BLUEJACKETS;
        break;
      case "OK":
        initialSelectedTeam = teams.STARS;
        break;
      case "OR":
        initialSelectedTeam = teams.CANUCKS;
        break;
      case "PA":
        initialSelectedTeam = teams.PENGUINS; //TODO
        break;
      case "RI":
        initialSelectedTeam = teams.BRUINS;
        break;
      case "SC":
        initialSelectedTeam = teams.HURRICANES;
        break;
      case "SD":
        initialSelectedTeam = teams.WILD;
        break;
      case "TN":
        initialSelectedTeam = teams.PREDATORS;
        break;
      case "TX":
        initialSelectedTeam = teams.STARS;
        break;
      case "UT":
        initialSelectedTeam = teams.KNIGHTS;
        break;
      case "VT":
        initialSelectedTeam = teams.BRUINS;
        break;
      case "VA":
        initialSelectedTeam = teams.CAPITALS;
        break;
      case "WA":
        initialSelectedTeam = teams.CANUCKS;
        break;
      case "WV":
        initialSelectedTeam = teams.PENGUINS;
        break;
      case "WI":
        initialSelectedTeam = teams.WILD;
        return;
      case "WY":
        initialSelectedTeam = teams.AVALANCHE;
        break;
      case "AB":
        initialSelectedTeam = teams.OILERS; //TODO
        break;
      case "BC":
        initialSelectedTeam = teams.CANUCKS;
        break;
      case "MB":
        initialSelectedTeam = teams.JETS;
        break;
      case "NB":
        initialSelectedTeam = teams.BRUINS;
        break;
      case "NL":
        initialSelectedTeam = teams.CANADIENS;
        break;
      case "NS":
        initialSelectedTeam = teams.CANADIENS;
        break;
      case "ON":
        initialSelectedTeam = teams.LEAFS;
        break;
      case "PE":
        initialSelectedTeam = teams.CANADIENS;
        break;
      default:
        initialSelectedTeam = teams.BRUINS;
        break;
    }

    this.machine.selectedTeam = initialSelectedTeam;
    Cookies.set("initialSelectedTeam", String(initialSelectedTeam));
  }

  @action
  componentDidMount()
  {
    this.setInitialSelectedTeam();

    const marginCookie = Cookies.get("margin");
    if (marginCookie !== undefined)
    {
      this.machine.margin = marginCookie;
    }
    else
    {
      this.machine.margin = this.machine.DEFAULT_MARGIN;
    }

    const percentCookie = Cookies.get("percentage");
    if (percentCookie !== undefined)
    {
      this.machine.percentage = percentCookie;
    }
    else
    {
      this.machine.percentage = this.machine.DEFAULT_PERCENTAGE;
    }

    const maxWinCookie = Cookies.get("maxWinDifferential");
    if (maxWinCookie !== undefined)
    {
      this.machine.maxWinDifferential = maxWinCookie;
    }
    else
    {
      this.machine.maxWinDifferential = this.machine.DEFAULT_WIN_DIFF;
    }

    //default to today's date
    let today: Date | string = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0
    let yyyy = today.getFullYear();
    let day = String(dd);
    let month = String(mm);
    let year = String(yyyy);
    if (dd < 10)
    {
      day = '0'+dd
    }
    if (mm < 10)
    {
      month = '0'+mm
    }
    today = year + "-" + month + "-" + day;

    this.machine.date = today;
  }

  private fetchData = async () => {
    const teamId = this.machine.selectedTeam;
    const dateStr = this.machine.date;

    if (dateStr == null)
    {
      this.machine.error = "Invalid date";
      return;
    }

    const day = dateStr.substring(8, 10);
    const date = new Date(dateStr);
    // const isValidDate = (Boolean(+date) && date.getDate() == day);

    if (date == null || date === undefined)
    {
      this.machine.error = "Invalid date";
      return;
    }
    
    // var absolute_path = __dirname;

    //TODO
    // const urlPrefix = this.machine.LOCAL ? "http:\//localhost:5000" : "https:\//nhl-should-i-watch.herokuapp.com"; //TODO:
    var url = "/api/worthWatching/" + teamId + "/" + dateStr;
    console.log("fetching url " + url);

    // const differential = document.getElementById("marginInp").value;
    // const randomPercent = document.getElementById("randomPercent").value;
    // const maxWinDifferential = document.getElementById("maxWinDifferential").value;
    const differential = this.machine.margin;
    const randomPercent = this.machine.percentage;
    const maxWinDifferential = this.machine.maxWinDifferential;

    const response = await this.postRequest(url, {differential: differential, randomPercent: randomPercent, maxWinDifferential: maxWinDifferential});

    if (response.error)
    {
      this.machine.error = response.error;
      return;
    }

    runInAction(() => {
      this.machine.error = response.error;
      this.machine.worthWatching = response.worthWatching;
    });    
  }

  private postRequest = async (url: string, data = {}) =>
  {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // redirect: 'follow', // manual, *follow, error
      // referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  @action
  onMarginChange = (e: React.FormEvent<HTMLInputElement>) => {
    const margin = e.currentTarget.value;
    this.machine.margin = margin;
    Cookies.set("margin", margin);
  }

  @action
  onPercentChange = (e: React.FormEvent<HTMLInputElement>) => {
    const percentage = e.currentTarget.value;
    this.machine.percentage = percentage;
    Cookies.set("percentage", percentage);
  }

  @action
  onTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = e.currentTarget.value;
    this.machine.selectedTeam = Number.parseInt(teamId);
    Cookies.set("initialSelectedTeam", teamId);
  }

  @action
  onMaxWinChange = (e: React.FormEvent<HTMLInputElement>) => {
    const maxWinDiff = e.currentTarget.value;
    this.machine.maxWinDifferential = maxWinDiff;
    Cookies.set("maxWinDifferential", maxWinDiff);
  }

  @action
  onDateChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.machine.date = e.currentTarget.value;
  }

  private renderTeamDropdown(): JSX.Element
  {
    return <>
      <label htmlFor="teamId">Team: </label>
      <select id="teamId" onChange={this.onTeamChange} value={this.machine.selectedTeam}>
        <option value={teams.DUCKS}>Anaheim Ducks</option>
        <option value={teams.COYOTES}>Arizona Coyotes</option>
        <option value={teams.BRUINS}>Boston Bruins</option>
        <option value={teams.SABRES}>Buffalo Sabres</option>
        <option value={teams.FLAMES}>Calgary Flames</option>
        <option value={teams.HURRICANES}>Carolina Hurricanes</option>
        <option value={teams.BLACKHAWKS}>Chicago Blackhawks</option>
        <option value={teams.AVALANCHE}>Colorado Avalanche</option>
        <option value={teams.BLUEJACKETS}>Columbus Blue Jackets</option>
        <option value={teams.STARS}>Dallas Stars</option>
        <option value={teams.REDWINGS}>Detroit Red Wings</option>
        <option value={teams.OILERS}>Edmonton Oilers</option>
        <option value={teams.PANTHERS}>Florida Panthers</option>
        <option value={teams.KINGS}>Los Angeles Kings</option>
        <option value={teams.WILD}>Minnesota Wild</option>
        <option value={teams.CANADIENS}>Montreal Canadiens</option>
        <option value={teams.PREDATORS}>Nashville Predators</option>
        <option value={teams.DEVILS}>New Jersey Devils</option>
        <option value={teams.ISLANDERS}>New York Islanders</option>
        <option value={teams.RANGERS}>New York Rangers</option>
        <option value={teams.SENATORS}>Ottawa Senators</option>
        <option value={teams.FLYERS}>Philadelphia Flyers</option>
        <option value={teams.PENGUINS}>Pittsburgh Penguins</option>
        <option value={teams.SHARKS}>San Jose Sharks</option>
        <option value={teams.BLUES}>St. Louis Blues</option>
        <option value={teams.LIGHTNING}>Tampa Bay Lightning</option>
        <option value={teams.LEAFS}>Toronto Maple Leafs</option>
        <option value={teams.CANUCKS}>Vancouver Canucks</option>
        <option value={teams.KNIGHTS}>Vegas Golden Knights</option>
        <option value={teams.CAPITALS}>Washington Capitals</option>
        <option value={teams.JETS}>Winnipeg Jets</option>
      </select>
    </>;
  }

  private renderNumberInput(id: string, value: string, label: string, tooltip: string,
    onChange: (e: React.FormEvent<HTMLInputElement>) => void): JSX.Element
  {
    return <>
      <label 
        htmlFor={id}
        title={tooltip}
      >
        {label}
      </label>
      &nbsp;
      <input 
        type="number"
        id={id}
        className="numberInput"
        value={value} 
        onChange={onChange}
      />
    </>;
  }

  render()
  {
    return (
      <div className="outerArea">
        <div className="App">
          <div className="upperHalf">
            <div className="headerSection">
              <h1>Should I Watch?</h1>
              <h3>Quickly find out if a recorded NHL game is worth watching</h3>
            </div>
            <div className="columnSection gameOptions">
              {this.renderTeamDropdown()}
              &nbsp;
              <label htmlFor="date">Game Date: </label>
              <input type="date" id="date" value={this.machine.date} onChange={this.onDateChange}/>

              &nbsp;
              <button onClick={this.fetchData}>Should I Watch?</button>
            </div>
            <div className="columnSection resultsArea">
              {
                this.machine.worthWatching != null && this.machine.error == null &&
                <div className={this.machine.worthWatching ? "resultYes" : "resultNo"}>
                  {this.machine.worthWatching ? "YES" : "NO"}
                </div>
              }
              {
                this.machine.error != null &&
                <div className="resultError">
                  {this.machine.error}
                </div>
              }
              {
                this.machine.error == null && this.machine.worthWatching == null &&
                <div className="resultPlaceholder">&nbsp;</div>
              }
            </div>
      
            <div className="columnSection metrics">
              <details>
                <summary>Adjust Metrics</summary>
                {this.renderNumberInput("marginInp", 
                  this.machine.margin,
                  "Losing Margin:",
                  "Number of goals your team can lose by and still return YES", 
                  this.onMarginChange)}
                <br/>
                {this.renderNumberInput("maxWinDifferential", 
                  this.machine.maxWinDifferential, 
                  "Max Win Differential:",
                  "Number of goals your team can win by and still return YES",
                  this.onMaxWinChange)}
                <br/>
                {this.renderNumberInput("randomPercent",
                  this.machine.percentage,
                  "Random Percentage:",
                  "The probability of returning YES when it would otherwise return NO",
                  this.onPercentChange)}
               </details>
            </div>
            <div className="footer">
              Questions or feedback? Email nhlshouldiwatchapp@gmail.com
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;

//TODO: when changing team selection, remove previous results
//implement check for games in progress (?)
//expanding metrics moves the carat around on the screen
//does everything work with 0? 
//error handling for invalid number / negative numbers


/*
Metric ideas:
  -overtime (if losing margin is 0)
  -first career goal (your team / either team)
  -hat trick (your team / either team)
  -fight (player / anyone)
*/