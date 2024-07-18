"use client";
import React, { useCallback, useRef, useState } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import { sectionalPieces } from "./data/sofas";

const generateUniqueId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const RightPlaceholder = React.memo(({ index, onDropCanvas, onDragOver }) => {
  return (
    <div
      className={`${styles.placeholder}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDropCanvas(e, index)}
    >
      <span className={styles.crossIcon}>
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.5 2.2a10.3 10.3 0 1 0 10.3 10.3A10.299 10.299 0 0 0 12.5 2.2zm0 19.6a9.3 9.3 0 1 1 9.3-9.3 9.31 9.31 0 0 1-9.3 9.3zM13 12h5v1h-5v5h-1v-5H7v-1h5V7h1z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
      </span>
    </div>
  );
});

const WrongPlaceholder = React.memo(({ index, onDragOver }) => {
  return (
    <div
      className={`${styles.placeholderRed} ${styles.validDrop}`}
      onDragOver={onDragOver}
      onDrop={(e) => alert("sofa piece doesn't fit")}
    >
      <span className={styles.crossIcon}>&#128711;</span>
    </div>
  );
});

const Home = () => {
  const [nodes, setNodes] = useState([]);
  const [removePiece, setRemovePiece] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const dropOnlyOnce = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const piece = JSON.parse(e.dataTransfer.getData("application/reactflow"));
    let newNode = {
      ...piece,
      id: generateUniqueId(),
      uid: piece.id,
    };

    if (nodes.length === 0) {
      setNodes([...nodes, newNode]);
      return;
    }
  };

  const onDropCanvas = useCallback((e, index) => {
    e.preventDefault();
    setIsDragging(false);
    const piece = JSON.parse(e.dataTransfer.getData("application/reactflow"));

    const newNodes = [...nodes];
    let newNode = {
      ...piece,
      id: generateUniqueId(),
      uid: piece.id,
    };

    if (nodes.length === 0) {
      setNodes([newNode]);
      return;
    }

    if (nodes.length === 1) {
      newNodes.splice(index, 0, newNode);
    } else {
      newNodes.splice(index, 0, newNode);
    }

    setNodes(newNodes);
  }, [nodes]);

  const handleDragStart = (e, piece) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(piece));
    localStorage.setItem("application/reactflow", JSON.stringify(piece));
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const renderPlaceholder = (index, pos, id) => {
    const leftSofas = [1, 2, 5, 7, 9, 10, 13, 15, 17, 19, 23];
    const rightSofas = [6, 8, 11, 12, 14, 16, 18, 20, 22];
    const middleSofas = [3, 4, 21, 24];
    const draggedPiece = JSON.parse(
      localStorage.getItem("application/reactflow")
    );

    if (nodes.length === 0) {
      return null;
    }

    if (isDragging) {
      if (
        pos === "start" &&
        !leftSofas.includes(id)
      ) {
        if (!rightSofas.includes(draggedPiece.uid)) {
          return <RightPlaceholder index={index} onDropCanvas={onDropCanvas} onDragOver={onDragOver} />;
        } else {
          return <WrongPlaceholder index={index} onDragOver={onDragOver} />;
        }
      }
      if (
        pos === "end" &&
        !rightSofas.includes(id)
      ) {
        if (!leftSofas.includes(draggedPiece.uid)) {
          return <RightPlaceholder index={index} onDropCanvas={onDropCanvas} onDragOver={onDragOver} />;
        } else {
          return <WrongPlaceholder index={index} onDragOver={onDragOver} />;
        }
      }
      if (index > 0 && index < nodes.length) {
        if (middleSofas.includes(draggedPiece.uid)) {
          return <RightPlaceholder index={index} onDropCanvas={onDropCanvas} onDragOver={onDragOver} />;
        } else {
          return <WrongPlaceholder index={index} onDragOver={onDragOver} />;
        }
      }
    }
    return null;
  };

  const startOver = () => {
    setNodes([]);
  };

  const handleNodeDragStart = (e, node) => {
    e.dataTransfer.setData("nodeId", node.id);
    e.dataTransfer.effectAllowed = "move";
    setRemovePiece(true);
  };

  const handleNodeDrop = (e, index) => {
    e.preventDefault();
  };

  const handleStartOverDrop = (e) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData("nodeId");
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setRemovePiece(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section_planner}>
        <div
          onDragOver={onDragOver}
          onDrop={(e) => dropOnlyOnce(e)}
          className={styles.canvas}
        >
          <div style={{ display: "flex" }}>
            {renderPlaceholder(0, "start", nodes[0]?.uid)}
            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                {renderPlaceholder(index, "", node.uid)}
                <div
                  className={styles.component}
                  draggable
                  onDragStart={(e) => handleNodeDragStart(e, node)}
                  onDragEnd={handleNodeDrop}
                  onDragOver={onDragOver}
                >
                  <img
                    src={node.image}
                    alt={node.name}
                    className={`${
                      [17, 18].includes(node?.uid) && styles.threeSofaPiece
                    } ${
                      [9, 10, 11, 12, 13, 14].includes(node?.uid)
                        ? styles.rightArmBumper
                        : styles.normalImage
                    }`}
                  />
                </div>
              </React.Fragment>
            ))}
            {renderPlaceholder(
              nodes?.length,
              "end",
              nodes[nodes.length - 1]?.uid
            )}
          </div>
        </div>
        {removePiece ? (
          <div
            onDragOver={onDragOver}
            onDrop={handleStartOverDrop}
            className={styles.removeContainer}
          >
            Drop to Remove Piece
          </div>
        ) : (
          <div className={styles.sofas_container}>
            <div className={styles.heading}>Sectional Sofa Pieces</div>
            <div className={styles.sofas}>
              {sectionalPieces.map((sofa) => (
                <div className={styles.img_container} key={sofa.id}>
                  {/* {sofa.uid} */}
                  <Image
                    onDragEnd={handleDragEnd}
                    onDragOver={onDragOver}
                    onDragStart={(e) => handleDragStart(e, sofa)}
                    className={styles.img}
                    src={sofa.image}
                    alt="url"
                    fill={true}
                    draggable
                  />
                </div>
              ))}
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleStartOverDrop}
              className={styles.btn_container}
            >
              <div className={styles.button} onClick={startOver}>
                Start Over
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
