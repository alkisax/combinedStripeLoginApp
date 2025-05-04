import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import axios from "axios";
import CardImages from "../components/cardImages";
import Question from "../components/Question";
import Settings from "../components/Settings"
import Language from "../components/Language"

import { Link } from 'react-router-dom';

const Home = () => {
  const [ gptResponse, setGptResponse ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState("");
  const [ selectedCards, setSelectedCards ] = useState([]);
  const [ drawnCards, setDrawnCards ] = useState({ first: null, second: null,third: null });
  const [ newQuestion, setNewQuestion ] = useState('')
  const [ question, setQuestion ] = useState('')
  const [ bias, setBias ] = useState('');
  const [ lang, setLang ] = useState('en')
  
  // const [ viewDeck, setViewDeck ] = useState(false)

  useEffect(() => {
    if (question) {
      axios
      .get("https://biasedtarot.onrender.com/test-openai", {
        params: { userQuestion: question, bias: bias, lang: lang }
      }) // Adjust if your backend is hosted elsewhere
      .then((response) => {
        setDrawnCards(response.data.drawnCards);
        setSelectedCards(response.data.selectedCards);
        setGptResponse(response.data.gptResponse);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching response:", error); // Logs error to console
        setError("Failed to fetch Tarot reading.");
        setLoading(false);
      });
    }
  }, [question, bias, lang]);

  useEffect(() => {
    if (drawnCards.length > 0) {
      // This effect will run whenever `drawnCards` is updated
      console.log("drawnCards", drawnCards);
      console.log("selectedCards", selectedCards);
    }
  }, [drawnCards, selectedCards]);  

  // Function to map card indices to image paths
  const mapCardToImage = (cardIndex) => {
    return `/deck1/${cardIndex}.jpg`; // Path to the image using the card index
  };

  const parseResponse = () => {
    const cleanResponse = gptResponse.replace(/<\/?pre>/g, ""); // Remove <pre> and </pre> tags
    return cleanResponse.split("\n").map((line, index) => (
      <p key={index}>{line}</p>
    ));
  };

  const reschafle = () => {
    window.location.reload();
  };

  const handleQuestionChange = (event) => {
    console.log(event.target.value)
    setNewQuestion(event.target.value)
  }

  const handleShowDeck = () => {
    // setViewDeck(prevState => !prevState);
  }

  const addquestion = (event) => {
    event.preventDefault()
    setLoading(true)
    setQuestion(newQuestion)
    setNewQuestion('')
  }

  document.body.classList.add('bg-dark');

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-dark text-white">

      <div className="container d-flex flex-column justify-content-center align-items-center py-4">

        <div>
            <Language lang={lang} setLang={setLang} />
        </div>


        <div className="d-flex justify-content-center row">
          <div className="text-center mb-4 col-4 d-flex align-items-stretch">
            <Link to="/deck1">
              <button onClick={handleShowDeck} className="btn btn-light">Show Deck</button>
            </Link>
          </div>
          <div className="col-1"></div>
          <div className="text-center mb-4 col-4 d-flex align-items-stretch">
            <button onClick={reschafle} className="btn btn-light ml-3">Reshuffle</button>
          </div>
        </div>

        <div className="viewDeck {}" id="viewDeck" >
        </div>

        <div className="viewQuestion" id="viewQuestion" >
          <Question newQuestion={newQuestion} handleQuestionChange={handleQuestionChange} addquestion={addquestion} />
    
        <div>
          <h1 className="mb-4">Tarot Reading</h1>
          {loading ? (
            <p>Loading...</p> // Display loading message only while waiting for response
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p> // Display error message
          ) : question ? ( 
            // Only show results if a question has been submitted
            <div>
              <CardImages drawnCards={drawnCards} mapCardToImage={mapCardToImage} />
              <div>{parseResponse()}</div>
            </div>
          ) : (
            <br />
          )} {/* Show nothing if no question has been submitted */}
        </div>

        </div>

        <div>
          <Settings setBias={setBias} />

          {bias && (
            <p>Selected Bias: {bias}</p>
          )}

        </div>

      </div>
    </div>
  );
};

export default Home;
