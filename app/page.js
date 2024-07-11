"use client";
import React, { useCallback, useRef, useState } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import { sectionalPieces } from "./data/sofas";

const Home = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(
    sectionalPieces
      .filter((piece) => piece.show_default)
      .map((piece) => ({
        id: piece.id,
        uid:piece.uid,
        image: piece.image,
        isPlaceholder: false,
      }))
  );
  const [idCounter, setIdCounter] = useState(1); // Initialize ID counter

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e, piece) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(piece));
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropCanvas = (e, index) => {
    e.preventDefault();
    setIsDragging(false);
    const piece = JSON.parse(e.dataTransfer.getData("application/reactflow"));

    const canPlaceBetween = (piece, index) => {
      const beforePiece = nodes[index - 1];
      const afterPiece = nodes[index];

      if (!beforePiece && !afterPiece) {
        return true; // Can place anywhere if canvas is empty
      } else if (!beforePiece && afterPiece) {
        return canPlaceRight(piece, afterPiece.uid);
      } else if (beforePiece && !afterPiece) {
        return canPlaceLeft(piece, beforePiece.uid);
      } else {
        return (
          canPlaceBetweenIds(piece, beforePiece.uid, afterPiece.uid) ||
          canPlaceRight(piece, afterPiece.uid) ||
          canPlaceLeft(piece, beforePiece.uid)
        );
      }
    };

    const canPlaceBetweenIds = (piece, id1, id2) => {
      return piece.in_between.some(
        (ib) =>
          (ib.between &&
            ib.between.includes(id1) &&
            ib.between.includes(id2)) ||
          (ib.left && ib.left.includes(id1)) ||
          (ib.right && ib.right.includes(id2))
      );
    };

    const canPlaceRight = (piece, id) => {
      return piece.in_between.some((ib) => ib.right && ib.right.includes(id));
    };

    const canPlaceLeft = (piece, id) => {
      return piece.in_between.some((ib) => ib.left && ib.left.includes(id));
    };

    if (canPlaceBetween(piece, index)) {
      const newNodes = [...nodes];
      newNodes.splice(index, 0, {
        ...piece,
        id: `node-${idCounter}`, // Generate unique ID using counter
        uid:piece.id,
        isPlaceholder: false,
      });
      setNodes(newNodes);
      setIdCounter(idCounter + 1); // Increment the counter
    } else {
      alert(
        "This piece cannot be placed between the existing components."
      );
    }
  };

  const onDropSectionalPieces = (e, piece) => {
    e.preventDefault();
    setIsDragging(false);
    const filteredNodes = nodes.filter((node) => node.id !== piece.id);
    setNodes(filteredNodes);
  };

  const renderPlaceholder = (index, validDrop) => {
    if (isDragging && index > 0 && index < nodes.length) {
      const draggedPiece = JSON.parse(
        localStorage.getItem("application/reactflow")
      );

      const canPlaceBetween = (piece, index) => {
        const beforePiece = nodes[index - 1];
        const afterPiece = nodes[index];

        if (!piece || !Array.isArray(piece.in_between)) {
          return false; // Handle case where piece or piece.in_between is not as expected
        }

        if (!beforePiece && !afterPiece) {
          // Empty canvas, can place anywhere
          return true;
        } else if (!beforePiece && afterPiece) {
          // Check if piece can be placed at the beginning
          return canPlaceRight(piece, afterPiece.id);
        } else if (beforePiece && !afterPiece) {
          // Check if piece can be placed at the end
          return canPlaceLeft(piece, beforePiece.id);
        } else {
          // Check if piece can be placed between two existing pieces
          return (
            canPlaceBetweenIds(piece, beforePiece.id, afterPiece.id) ||
            canPlaceRight(piece, afterPiece.id) ||
            canPlaceLeft(piece, beforePiece.id)
          );
        }
      };

      const canPlaceBetweenIds = (piece, id1, id2) => {
        return piece.in_between.some(
          (ib) =>
            (ib.between &&
              ib.between.includes(id1) &&
              ib.between.includes(id2)) ||
            (ib.left && ib.left.includes(id1)) ||
            (ib.right && ib.right.includes(id2))
        );
      };

      const canPlaceRight = (piece, id) => {
        return piece.in_between.some(
          (ib) => ib.right && ib.right.includes(id)
        );
      };

      const canPlaceLeft = (piece, id) => {
        return piece.in_between.some(
          (ib) => ib.left && ib.left.includes(id)
        );
      };

      if (canPlaceBetween(draggedPiece, index)) {
        return (
          <div
            key={`placeholder-${index}`}
            className={`${styles.placeholder} ${styles.validDrop}`}
            onDragOver={onDragOver}
            onDrop={(e) => onDropCanvas(e, index)}
            style={{ height: 150, width: 60 }}
          >
            <span className={styles.addIcon}>+</span>
          </div>
        );
      } else {
        return (
          <div
            key={`placeholder-${index}`}
            className={`${styles.placeholder} ${styles.invalidDrop}`}
            onDragOver={onDragOver}
            onDrop={(e) => onDropCanvas(e, index)}
            style={{ height: 150, width: 60 }}
          >
            <span className={styles.crossIcon}>X</span>
          </div>
        );
      }
    }

    // Return null if not dragging or if index is at the start or end
    return null;
  };

  const startOver = () => {
    setNodes(
      sectionalPieces
        .filter((piece) => piece.show_default)
        .map((piece) => ({
          id: piece.id,
          image: piece.image,
          isPlaceholder: false,
        }))
    );
  };


  
  const handleNodeDragStart = (e, node) => {
    e.dataTransfer.setData('nodeId', node.id);
    e.dataTransfer.effectAllowed = 'move';
    
  };
  
  const handleNodeDragEnd = (e) => {
    e.preventDefault();
  };



  const [isInDragState, setIsInDragState] = useState(false);


  const handleNodeDrop = (e, index) => {
    e.preventDefault();
   //const nodeId = e.dataTransfer.getData('nodeId');
   // setNodes((prevNodes) => prevNodes.filter(node => node.id !== nodeId));
  };

  const handleStartOverDrop = (e) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('nodeId');
    setNodes((prevNodes) => prevNodes.filter(node => node.id !== nodeId));
  };

  

  return (
    <div className={styles.container}>
      <div className={styles.section_planner}>
        <div ref={reactFlowWrapper} className={styles.canvas}>
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {renderPlaceholder(index, true)}
              <div
                className={styles.component}
                draggable
                onDragStart={(e) => handleNodeDragStart(e, node)}
                onDragEnd={handleNodeDragEnd}
                onDragOver={onDragOver}
                onDrop={(e) => handleNodeDrop(e, index)}
              >
                <img src={node.image} alt={node.name} style={{ height: 80 }} />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className={styles.sofas_container}>
          <div className={styles.heading}>Sectional Sofa Pieces</div>
          <div className={styles.sofas}>
            {sectionalPieces.map((sofa) => (
              <div
                className={styles.img_container}
                key={sofa.id}
                onDragStart={(e) => handleDragStart(e, sofa)}
                onDragEnd={handleDragEnd}
                onDragOver={onDragOver}
                // onDrop={(e) => onDropSectionalPieces(e, sofa)}
              >
                <img
                  className={styles.img}
                  src={sofa.image}
                  alt={sofa.name}
                  draggable
                />
              </div>
            ))}
          </div>
          <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleStartOverDrop}
          className={styles.btn_container}>
            <div className={styles.button} onClick={startOver}>
              Start Over
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;




