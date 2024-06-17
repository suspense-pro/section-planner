const ImageNode = ({ data }) => {
  console.log(data);
  return (
    <>
      <img
        onDragOver={(e) => console.log("on me")}
        style={{ height: "67px" }}
        src={data.url}
        alt="hello"
      />
    </>
  );
};

export default ImageNode;
