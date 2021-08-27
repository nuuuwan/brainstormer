import { Component } from "react";
import { Graph } from "react-d3-graph";

import './BrainGraph.css';

const INITIAL_DATA = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  links: [
    { source: "Harry", target: "Sally" },
    { source: "Harry", target: "Alice" },
  ],
};

function getNewNodeID() {
  const unixTimeMicro = Math.floor(Date.now());
  return `node.${unixTimeMicro}`;
}

export default class BrainGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: INITIAL_DATA,
      nodeToLabel: {},
      selectedNodeID: INITIAL_DATA.nodes[0].id,
    };
  }

  nodeViewGenerator(node) {
    const {nodeToLabel, selectedNodeID} = this.state;
    const nodeID = node.id;
    const label = nodeToLabel[nodeID] ? nodeToLabel[nodeID] : nodeID;
    const classNameIfSelected = (selectedNodeID === nodeID) ? 'div-node-selected': '';
    return (
      <div className={"div-node " + classNameIfSelected}>
        {label}
      </div>
    );
  }

  render() {
    const { data, selectedNodeID, nodeToLabel } = this.state;

    const config = {
      width: 2000,
      height: 1000,
      nodeHighlightBehavior: true,
      node: {
        color: "lightgray",
        size: {
           height: 675,
           width: 1200,
        },

        highlightStrokeColor: "lightgray",
        viewGenerator: this.nodeViewGenerator.bind(this),
        renderLabel: false,
      },
      link: {
        highlightColor: "lightgray",
        strokeWidth: 1,
      },
    };

    const onClickNode = function (nodeId) {
      this.setState({selectedNodeID: nodeId})
    }.bind(this);

    const onDoubleClickNode = function(nodeId) {
      let newData = this.state.data;
      const newNodeID = getNewNodeID();
      newData.nodes.push({
        id: newNodeID,
      })
      newData.links.push({
        source: nodeId,
        target: newNodeID,
      });
      this.setState({data: newData})
    }.bind(this);

    const onChangeSelectedNodeInput = function(e) {
      const newNodeID = e.target.value;
      let selectedNodeID = this.state.selectedNodeID;
      let newNodeToLabel = this.state.nodeToLabel;
      newNodeToLabel[selectedNodeID] = e.target.value;

      this.setState({
        nodeToLabel: newNodeToLabel,
      })
    }.bind(this);

    return (
      <>
        <textarea
          className="textarea"
          value={nodeToLabel[selectedNodeID]}
          onChange={onChangeSelectedNodeInput}
        />
        <Graph
          id="graph-id"
          data={data}
          config={config}
          onClickNode={onClickNode}
          onDoubleClickNode={onDoubleClickNode}
        />
      </>
    );
  }
}
