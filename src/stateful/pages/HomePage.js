import { Component } from "react";

import BrainGraph from "../molecules/BrainGraph.js";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <h1>BrainStormer</h1>
        <BrainGraph />
      </div>
    );
  }
}
