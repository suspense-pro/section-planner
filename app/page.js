"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
} from "react-flow-renderer";
import "reactflow/dist/style.css";
import CustomNode from "./components/CustomeNode";
const imageUrls = [
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_82/item_661_82_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_172/item_661_172_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_58/item_661_58_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_108/item_661_108_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_149/item_661_149_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_150/item_661_150_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_157/item_661_157_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_158/item_661_158_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_627/item_661_627_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_78/item_661_78_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_628/item_661_628_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_79/item_661_79_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_389/item_661_389_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_390/item_661_390_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_64/item_661_64_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_66/item_661_66_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_83/item_661_83_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_84/item_661_84_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_674/item_661_674_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_675/item_661_675_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_358/item_661_358_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_691/item_661_691_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_690/item_661_690_2480_0.thumb.jpg?v=73",
  "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_709/item_661_709_2480_0.thumb.jpg?v=73",
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Home = () => {
  const reactFlowWrapper = useRef(null);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes] = useState([]);
  const nodeTypes = useMemo(() => ({ imgNode: CustomNode }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const handleDragStart = (e, url) => {
    e.dataTransfer.setData("application/reactflow", url);
    e.dataTransfer.effectAllowed = "move";

    console.log("eve", e);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const getImageDimensions = (url) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = url;
    });
  };

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Get the dimensions of the image
      const { width: nodeWidth, height: nodeHeight } = await getImageDimensions(
        type
      );

      const adjustedPosition = {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
      };

      const newNode = {
        id: getId(),
        type: "imgNode",
        position: adjustedPosition,
        data: { url: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className={styles.container}>
      <div className={styles.section_planner}>
        <div
          ref={reactFlowWrapper}
          height={648}
          width={646}
          className={styles.canvas}
        >
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodesChange={onNodesChange}
            onInit={setReactFlowInstance}
            // fitView
          >
            {/* <Background
              style={{ backgroundColor: "#f6f7fc" }}
              variant="dots"
              gap={24}
              size={1}
            /> */}
          </ReactFlow>
        </div>
        <div className={styles.sofas_container}>
          <div className={styles.heading}>Sectional Sofa Pieces</div>
          <div className={styles.sofas}>
            {imageUrls.map((url) => (
              <div className={styles.img_container} key={url}>
                <Image
                  onDragStart={(e) => handleDragStart(e, url)}
                  className={styles.img}
                  src={url}
                  alt="url"
                  fill={true}
                  draggable
                />
              </div>
            ))}
          </div>
          <div className={styles.btn_container}>
            <div className={styles.button}>Start Over</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
