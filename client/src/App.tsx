import React from 'react';
import './App.css';
import {observer} from "mobx-react";
import {makeObservable, observable, runInAction} from "mobx";

export class AppMachine
{
  @observable testData: any = null;

  constructor()
  {
    makeObservable(this);
  }
}

export interface AppProps
{

}

@observer
class App extends React.Component<AppProps>
{
  private machine: AppMachine = new AppMachine();

  private async fetchData(): Promise<void>
  {
    const testDataRaw = await fetch('/test');
    const td = await testDataRaw.json();

    runInAction(() => this.machine.testData = td.message);
  }

  componentDidMount()
  {
    this.fetchData();
  }

  render()
  {
    return <div className="App">
      The value returned from the server is:
      {this.machine.testData}
    </div>
  }
}

export default App;
