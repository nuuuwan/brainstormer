import { Component } from "react";
import { Graph } from "react-d3-graph";


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
    this.state = {
      data: INITIAL_DATA,
      nodeToLabel: {},
      selectedNodeID: INITIAL_DATA.nodes[0].id,
    };
  }

  nodeViewGenerator(node) {
    const {nodeToLabel} = this.state;
    const label = nodeToLabel[node.id] ? nodeToLabel[node.id] : node.id;
    return (
      <div>
        {label}
      </div>
    );
  }

  render() {
    const { data, selectedNodeID, nodeToLabel } = this.state;

    const config = {
      nodeHighlightBehavior: true,
      node: {
        color: "pink",
        size: 500,
        highlightStrokeColor: "red",
        viewGenerator: this.nodeViewGenerator.bind(this),
        renderLabel: false,
      },
      link: {
        highlightColor: "red",
        strokeWidth: 1,
      },
    };

    //   let newData = this.state.data;
    //   newData.nodes.push({
    //     id: 'New Node',
    //   })
    //   newData.links.push({
    //     source: nodeId,
    //     target: 'New Node',
    //   })

    const onClickNode = function (nodeId) {
      this.setState({selectedNodeID: nodeId})
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
          value={nodeToLabel[selectedNodeID]}
          onChange={onChangeSelectedNodeInput}
        />
        <Graph
          id="graph-id"
          data={data}
          config={config}
          onClickNode={onClickNode}
        />
      </>
    );
  }
}
