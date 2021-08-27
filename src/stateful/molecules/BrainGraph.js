import { Component } from "react";
import { Graph } from "react-d3-graph";
import ReactMarkdown from "react-markdown";

import "./BrainGraph.css";

const CACHE_KEY_GRAPH_STATE = "brainstormer.graphstate";

function getInitGraphState() {
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

function getGraphState() {
  const data = window.localStorage.getItem(CACHE_KEY_GRAPH_STATE);
  if (!data) {
    return getInitGraphState();
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
    this.state = {data: null};
  }

  addNewNode() {
    const { selectedNodeID } = this.state;
    let newData = this.state.data;
    const newNodeID = getNewNodeID();
    newData.nodes.push({
      id: newNodeID,
    });
    newData.links.push({
      source: selectedNodeID,
      target: newNodeID,
    });
    this.setStateAndSave({ data: newData });
  }

  deleteSelectedNode() {
    const { selectedNodeID } = this.state;
    let newData = this.state.data;
    newData.nodes = newData.nodes.filter(
      (node) => node.id !== selectedNodeID
    );
    newData.links = newData.links.filter(
      (link) =>
        link.target !== selectedNodeID && link.source !== selectedNodeID
    );
    this.setStateAndSave({ data: newData });
  }

  onKeyDown(e) {
    if (e.key === "Tab") {
      this.addNewNode();

    } else if (e.key === "Backspace") {
      this.deleteSelectedNode();

    }
  }

  componentDidMount() {
    const { data, nodeToLabel, selectedNodeID } = getGraphState();
    this.setState({data, nodeToLabel, selectedNodeID});
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown.bind(this), false);
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
    if (!this.state.data) {
      return '...';
    }
    const { data, selectedNodeID, nodeToLabel } = this.state;

    const config = {
      width: 1600,
      height: 900,
      nodeHighlightBehavior: true,
      node: {
        color: "lightgray",
        size: {
          height: 900,
          width: 1600,
        },

        highlightStrokeColor: "lightgray",
        viewGenerator: this.nodeViewGenerator.bind(this),
        renderLabel: false,
      },
      link: {
        highlightColor: "lightgray",
        strokeWidth: 1,
      },
      d3: {
        gravity: -2000,
      },
    };

    const onClickNode = function (nodeId) {
      this.setStateAndSave({ selectedNodeID: nodeId });
    }.bind(this);

    const onChangeSelectedNodeInput = function (e) {
      let selectedNodeID = this.state.selectedNodeID;
      let newNodeToLabel = this.state.nodeToLabel;

      const value = e.target.value;

      newNodeToLabel[selectedNodeID] = value;
      this.setStateAndSave({
        nodeToLabel: newNodeToLabel,
      });
    }.bind(this);

    return (
      <div>
        <textarea
          className="textarea"
          onChange={onChangeSelectedNodeInput}
          value={nodeToLabel[selectedNodeID]}
        />
        <Graph
          id="graph-id"
          data={data}
          config={config}
          onClickNode={onClickNode}
          onDoubleClickNode={onClickNode}
        />
      </div>
    );
  }
}
