import { useState } from "react";

const ImageNode = ({ data }) => {
  const [images, setImages] = useState([data.url]);

  return (
    <>
      {images?.map((img, id) => {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={id}
            onDrop={(e) => {
              e.preventDefault();
              const type = e.dataTransfer.getData("application/reactflow");
              console.log("type", type);
              setImages([...images, type]);
            }}
            style={{ height: "67px" }}
            src={img}
            alt="hello"
          />
        );
      })}
    </>
  );
};

export default ImageNode;
