import { Component } from "react";
import { Graph } from "react-d3-graph";
import ReactMarkdown from "react-markdown";

import "./BrainGraph.css";

const CACHE_KEY_GRAPH_STATE = "brainstormer.graphstate";

function getGraphState() {
  const data = window.localStorage.getItem(CACHE_KEY_GRAPH_STATE);
  if (!data) {
    const rootNodeID = getNewNodeID();
    return {
      data: {
        nodes: [{ id: rootNodeID, x: 200, y: 200 }],
        links: [],
      },
      nodeToLabel: { [rootNodeID]: "Root" },
      selectedNodeID: rootNodeID,
    };
  }
  const dataJSON = JSON.parse(data);
  return dataJSON;
}

function setGraphState(dataJSON) {
  const data = JSON.stringify(dataJSON);
  window.localStorage.setItem(CACHE_KEY_GRAPH_STATE, data);
}

function getNewNodeID() {
  const unixTimeMicro = Math.floor(Date.now());
  return `node.${unixTimeMicro}`;
}

export default class BrainGraph extends Component {
  constructor(props) {
    super(props);
    const { data, nodeToLabel, selectedNodeID } = getGraphState();
    this.state = {
      data,
      nodeToLabel,
      selectedNodeID,
    };
  }

  save() {
    const { data, nodeToLabel, selectedNodeID } = this.state;
    setGraphState({
      data,
      nodeToLabel,
      selectedNodeID,
    });
  }

  setStateAndSave(newState) {
    this.setState(
      newState,
      function () {
        this.save();
      }.bind(this)
    );
  }

  nodeViewGenerator(node) {
    const { nodeToLabel, selectedNodeID } = this.state;
    const nodeID = node.id;
    const label = nodeToLabel[nodeID] ? nodeToLabel[nodeID] : nodeID;
    const classNameIfSelected =
      selectedNodeID === nodeID ? "div-node-selected" : "";
    return (
      <div className={"div-node " + classNameIfSelected}>
        <ReactMarkdown>{label}</ReactMarkdown>
      </div>
    );
  }

  render() {
    const { data, selectedNodeID, nodeToLabel } = this.state;

    const config = {
      width: 1600,
      height: 900,
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
      this.setStateAndSave({ selectedNodeID: nodeId });
    }.bind(this);

    const onDoubleClickNode = function (nodeId, node) {
      let newData = this.state.data;
      const { x, y } = node;
      const newNodeID = getNewNodeID();
      newData.nodes.push({
        id: newNodeID,
        x: x + 200,
        y: y,
      });
      newData.links.push({
        source: nodeId,
        target: newNodeID,
      });
      this.setStateAndSave({ data: newData });
    }.bind(this);

    const onChangeSelectedNodeInput = function (e) {
      let selectedNodeID = this.state.selectedNodeID;
      let newNodeToLabel = this.state.nodeToLabel;
      newNodeToLabel[selectedNodeID] = e.target.value;

      this.setStateAndSave({
        nodeToLabel: newNodeToLabel,
      });
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
