
const DisplayImagesFromContainer = ({blobList}) => (
    <div>
      <h2>Container items</h2>
      <ul>
        {blobList.map((item) => {
          return (
            <li key={item.name}>
              <div>
                {item.name}
                <br />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  export default DisplayImagesFromContainer;