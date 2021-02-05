import React from 'react';
import './App.css';
import Cookies from 'js-cookie';
import {observer} from "mobx-react";
import {makeObservable, observable, runInAction, action} from "mobx";
import { teams } from './teams';
import ReactTooltip from "react-tooltip";

export class AppMachine
{
  public DEFAULT_MARGIN: string = "1";
  public DEFAULT_PERCENTAGE = "10";
  public DEFAULT_WIN_DIFF = "3"

  @observable public error: any = null;
  @observable public worthWatching: boolean | null = null;
  @observable public selectedTeam: number = teams.BRUINS;
  @observable public margin: string | null = this.DEFAULT_MARGIN;
  @observable public percentage: string | null = this.DEFAULT_PERCENTAGE;
  @observable public maxWinDifferential: string | null = this.DEFAULT_WIN_DIFF;
  @observable public date: string = "";
  @observable public hatTrickHome: boolean = false;
  @observable public hatTrickAway: boolean = false;

  LOCAL = false;

  constructor()
  {
    makeObservable(this);
  }

  public makeInitialServerCall(): void
  {
    fetch("/api/initialStartup");
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
    this.machine.makeInitialServerCall()

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
    const hatTrickHome = this.machine.hatTrickHome;
    const hatTrickAway = this.machine.hatTrickAway;

    const response = await this.postRequest(url, 
      {differential: differential, randomPercent: randomPercent, maxWinDifferential: maxWinDifferential,
      hatTrickHome: hatTrickHome, hatTrickAway: hatTrickAway});

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
  private setMargin(margin: string): void
  {
    this.machine.margin = margin;
    Cookies.set("margin", margin);
  }

  onMarginChange = (e: React.FormEvent<HTMLInputElement>) => {
    let margin: string | null = e.currentTarget.value;

    if (Number.parseInt(margin, 10) < 0)
    {
      //don't allow negative numbers
      margin = this.machine.margin;
    }

    if (margin == null)
    {
      margin = "";
    }

    this.setMargin(margin);
  }

  @action
  private setPercentage(percentage: string): void
  {
    this.machine.percentage = percentage;
    Cookies.set("percentage", percentage);
  }

  onPercentChange = (e: React.FormEvent<HTMLInputElement>) => {
    let percentage: string | null = e.currentTarget.value;

    if (Number.parseInt(percentage, 10) < 0)
    {
      //don't allow negative numbers
      percentage = this.machine.percentage;
    }

    if (percentage == null)
    {
      percentage = "";
    }

    this.setPercentage(percentage);
  }

  @action
  onTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //reset result when team or date changes
    this.machine.worthWatching = null;
    this.machine.error = null;

    const teamId = e.currentTarget.value;
    this.machine.selectedTeam = Number.parseInt(teamId);
    Cookies.set("initialSelectedTeam", teamId);
  }

  @action
  private setMaxWin(maxWinDiff: string): void
  {
    this.machine.maxWinDifferential = maxWinDiff;
    Cookies.set("maxWinDifferential", maxWinDiff);
  }

  @action
  onMaxWinChange = (e: React.FormEvent<HTMLInputElement>) => {
    let maxWinDiff: string | null = e.currentTarget.value;

    if (Number.parseInt(maxWinDiff, 10) < 0)
    {
      //don't allow negative numbers
      maxWinDiff = this.machine.maxWinDifferential;
    }

    if (maxWinDiff == null)
    {
      maxWinDiff = "";
    }

    this.setMaxWin(maxWinDiff);
  }

  @action
  onDateChange = (e: React.FormEvent<HTMLInputElement>) => {
    //reset result when team or date changes
    this.machine.worthWatching = null;
    this.machine.error = null;

    this.machine.date = e.currentTarget.value;
  }

  @action
  onHatTrickHomeChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.machine.hatTrickHome = e.currentTarget.checked;
  }

  @action
  onHatTrickAwayChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.machine.hatTrickAway = e.currentTarget.checked;
  }

  @action
  private resetDefaultMetrics(): void
  {
    this.setMargin(this.machine.DEFAULT_MARGIN);
    this.setPercentage(this.machine.DEFAULT_PERCENTAGE);
    this.setMaxWin(this.machine.DEFAULT_WIN_DIFF);
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

  private renderNumberMetric(id: string, value: string | null, label: string, tooltip: string,
    onChange: (e: React.FormEvent<HTMLInputElement>) => void): JSX.Element
  {
    return <div className="metricRow">
      <input 
        type="number"
        id={id}
        className="numberInput"
        value={value == null ? "" : value} 
        onChange={onChange}
        // onInput={() => {this. = 
        //   !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null}}
      />
      
      &nbsp;

      <label htmlFor={id}>
        {/* {label} <span data-tip={tooltip}>&#9432;</span> */}
        {label}&nbsp;
        <span data-tip data-for={id}>
          &#9432;
        </span>
        <ReactTooltip id={id} place="top" effect="solid">
          {tooltip}
        </ReactTooltip>
      </label>
    </div>;
  }

  private renderHatTrickMetric(): JSX.Element
  {
    return <div className="metricRow">
      Hat Trick:
      <label>Home Team:</label>
      &nbsp;
      <input 
        type="checkbox" 
        id={"hatTrickMetric_home"} 
        checked={this.machine.hatTrickHome} 
        onChange={this.onHatTrickHomeChange}
      />
      <label>Away Team:</label>
      &nbsp;
      <input 
        type="checkbox" 
        id={"hatTrickMetric_home"} 
        checked={this.machine.hatTrickAway} 
        onChange={this.onHatTrickAwayChange}
      />
    </div>;
  }

  private renderFooter(): JSX.Element
  {
    return <div className="footer">
      <div className="footer_contents">
        Questions or feedback? Email <a href="mailto:nhlshouldiwatchapp@gmail.com">NHLShouldIWatchApp@gmail.com</a>
        <br/>
        Website Copyright &#169; {new Date().getFullYear()} Dirk Stahlecker
      </div>
    </div>;
  }

  private renderMetrics(): JSX.Element
  {
    return <div className="columnSection metricsWrapper">
      <div className="grid-container">
        <div className="metricHeader metricsHeader">Metrics:</div>
        <div className="englishHeader">Return YES if...</div>

        <div className="losingMargin">
          {this.renderNumberMetric("marginInp", 
              this.machine.margin,
              "Losing Goal Margin",
              "Number of goals your team can lose by and still return YES", 
              this.onMarginChange)}
        </div>
        <div className="losingMarginEnglish explanationColumn">
          Your team loses by no more than {this.machine.margin} goals AND
        </div>

        <div className="maxWin">
          {this.renderNumberMetric("maxWinDifferential", 
          this.machine.maxWinDifferential, 
          "Winning Goal Margin",
          "Number of goals your team can win by and still return YES",
          this.onMaxWinChange)}
        </div>
        <div className="maxWinEnglish explanationColumn">
          {
            this.machine.maxWinDifferential != null && 
            this.machine.maxWinDifferential !== "" && 
            Number.parseInt(this.machine.maxWinDifferential) > 0 &&
            <>{`Your team wins by no more than ${this.machine.maxWinDifferential} goals AND`}</>
          }
        </div>

        <div className="random">
          {this.renderNumberMetric("randomPercent",
            this.machine.percentage,
            "Random Percentage",
            "Random chance of returning YES when it would otherwise return NO",
            this.onPercentChange)}
        </div>
        <div className="randomEnglish explanationColumn">
          {
            this.machine.percentage != null && Number.parseInt(this.machine.percentage) > 0 &&
            <>A {this.machine.percentage}% chance of randomly saying YES anyway.</>
          }
        </div>
      </div>
      
      <button onClick={() => this.resetDefaultMetrics()}>Reset to defaults</button>
    </div>;
  }

  private renderResults(): JSX.Element
  {
    return <div className="columnSection resultsArea">
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
  }

  private renderHeader(): JSX.Element
  {
    return <div className="headerSection">
      <div><h1>Should I Watch?</h1></div>
      <div><h3>Quickly find out if a recorded NHL game is worth watching</h3></div>
    </div>
  }

  private renderGameOptions(): JSX.Element
  {
    return <div className="columnSection gameOptions">
      <div className="gameOptionsRow">{this.renderTeamDropdown()}</div>
      <div className="gameOptionsRow">
        <label htmlFor="date">Game Date: </label>
        <input type="date" id="date" value={this.machine.date} onChange={this.onDateChange}/>
      </div>
      <div className="gameOptionsRow">
        <button onClick={this.fetchData}>Should I Watch?</button>
      </div>
    </div>
  }

  render()
  {
    return (
      <div className="outerArea">
        <div className="App">
          {this.renderHeader()}
          <div className="bodySection">
            {this.renderGameOptions()}
            {this.renderResults()}
            <hr/>
            {this.renderMetrics()}
          </div>
        </div>
        {this.renderFooter()}
      </div>
    )
  }
}

export default App;


//implement check for games in progress (?)
//does everything work with 0? 
//error handling for invalid number / negative numbers
//try on mobile
//client validation of invalid numbers - just don't allow them to be typed in
//fix styling in firefox
//generate an english sentence explaining the chosen metric and put that at the top of the metrics section
  //"The game is worth watching if your team wins by no more than 3 goals or loses by no less than 1 goal, 
  //plus a 10% random chance of returning yes."



/*
Metric ideas:
  -overtime (if losing margin is 0)
  -first career goal (your team / either team)
  -fight (player / anyone)
  -goalie goal (your team / either team)
*/