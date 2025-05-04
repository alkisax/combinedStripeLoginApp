import { Link } from 'react-router-dom';

// Function to map card index to image path
const mapCardToImage = (cardIndex) => {
  return `/deck1/${cardIndex}.jpg`; // Path to the image using the card index
};

const Deck1btn = () => {
  return (
    <div>
      <h1>Deck1 Page</h1>
      <Link to="/">
        <button>Go to Home</button>
      </Link>
    </div>
  );
};

const Deck1 = () => {
  const imageCount = 78; // Update this to the number of images you have in the /deck1 folder

  // Generate an array with card indices from 0 to imageCount-1
  const cardIndexes = Array.from({ length: imageCount }, (_, index) => index);

  return (
    <div>
      <h1>This is the Deck1 Page</h1>
      <Deck1btn />
      
      <div className="image-gallery">
        {cardIndexes.map((index) => (
          <img
            key={index}
            src={mapCardToImage(index)}
            alt={`Card ${index}`}
            style={{ width: '100px', margin: '5px' }} // You can adjust the styling
          />
        ))}
      </div>
    </div>
  );
};

export default Deck1;
