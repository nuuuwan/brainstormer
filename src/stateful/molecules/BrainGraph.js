import { Component } from "react";
import { Graph } from "react-d3-graph";

const CONFIG = {
  nodeHighlightBehavior: true,
  node: {
    color: "pink",
    size: 500,
    highlightStrokeColor: "red",
  },
  link: {
    highlightColor: "red",
  },
};


const INITIAL_DATA = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  links: [
    { source: "Harry", target: "Sally" },
    { source: "Harry", target: "Alice" },
  ],
};

export default class BrainGraph extends Component {
  constructor(props) {
    super(props);
    const data = INITIAL_DATA;
    this.state = {data};
  }
  render() {
    const {data} = this.state;

    const onClickNode = function (nodeId) {
      window.alert(`Clicked node ${nodeId}`);
    };

    const onClickLink = function (source, target) {
      window.alert(`Clicked link between ${source} and ${target}`);
    };

    return (
      <Graph
        id="graph-id" // id is mandatory
        data={data}
        config={CONFIG}
        onClickNode={onClickNode}
        onClickLink={onClickLink}
      />
    );
  }
}
