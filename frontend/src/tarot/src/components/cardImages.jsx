import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const TarotCard = ({ position, index, mapCardToImage }) => (
  <div className="col-3 text-center">
    <h5>{position} Card</h5>
    <img
      src={mapCardToImage(index)}  // Pass the index to mapCardToImage
      alt={`Card ${position}`}
      className="img-fluid rounded"
    />
  </div>
);

const CardImages = ({ drawnCards, mapCardToImage }) => {
  if (!drawnCards || drawnCards.length < 3) {
    return <p>Error: Not enough cards drawn.</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Drawn Tarot Cards</h2>
      <div className="row justify-content-center">
        {/* Pass the index of the drawn card */}
        <TarotCard position="First" index={drawnCards.first} mapCardToImage={mapCardToImage} />
        <TarotCard position="Second" index={drawnCards.second} mapCardToImage={mapCardToImage} />
        <TarotCard position="Third" index={drawnCards.third} mapCardToImage={mapCardToImage} />
      </div>
    </div>
  );
};

export default CardImages;