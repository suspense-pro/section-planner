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
import { sectionalPieces } from "./data/sofas";

let id = 0;
const getId = () => `dndnode_${id++}`;

const Home = () => {
  const reactFlowWrapper = useRef(null);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes] = useState([
    {
      id: getId(),
      type: "imgNode",
      position: { x: 150, y: 150 },
      data: {
        url: "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_82/item_661_82_2480_0.thumb.jpg?v=73",
      },
    },
  ]);
  const nodeTypes = useMemo(() => ({ imgNode: CustomNode }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const handleDragStart = (e, url) => {
    e.dataTransfer.setData("application/reactflow", url);
    e.dataTransfer.effectAllowed = "move";
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
            {sectionalPieces.map((sofa) => (
              <div className={styles.img_container} key={sofa.id}>
                <Image
                  onDragStart={(e) => handleDragStart(e, sofa.image)}
                  className={styles.img}
                  src={sofa.image}
                  alt="url"
                  fill
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
