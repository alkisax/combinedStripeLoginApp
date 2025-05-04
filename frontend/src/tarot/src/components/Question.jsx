import 'bootstrap/dist/css/bootstrap.min.css';
const Question = ({ newQuestion, handleQuestionChange, addquestion }) => {
  return (
    <div className="mb-4">
      <h4 className="mb-3">Ask a Question:</h4>
      <form onSubmit={addquestion} className="d-flex align-items-center">
        <input
          type="text"
          value={newQuestion}
          onChange={handleQuestionChange}
          className="form-control me-2" // Adds padding and some margin
          placeholder="Type your question here"
        />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Question;