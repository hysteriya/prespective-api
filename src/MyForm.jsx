import React, { useState } from 'react';
import axios from 'axios';

const MyForm = () => {
  const [comment, setComment] = useState('');
  const [toxicityScore, setToxicityScore] = useState(null);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const getPerspectiveAPIScore = async (text) => {
    const apiKey = 'AIzaSyBndcjZUNQnfuW48BH06u28WuYk9WdJP8U';
    const apiUrl = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';
  
    try {
      const response = await axios.post(apiUrl, {
        comment: { text },
        languages: ['en'],
        requestedAttributes: { TOXICITY: {} },
        doNotStore: true,
      }, {
        params: { key: apiKey },
      });
  
      if (response.data.attributeScores && response.data.attributeScores.TOXICITY) {
        const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value;
        console.log(`Toxicity Score: ${toxicityScore}`);
        return toxicityScore;
      }
  
      throw new Error('Unable to retrieve toxicity score');
    } catch (error) {
      console.error('Error calling Perspective API:', error.message);
      throw error;
    }
  };
  const submitForm = async ()=>{
    console.log('data sent.')
  }
  const checkMessage = async (event) => {
    event.preventDefault();

    try {
      // Call the Perspective API with the comment text
      const score = await getPerspectiveAPIScore(comment);
      setToxicityScore(score);
        
      if (score > 0.7) {
        alert('offensive message');
        console.log('This message may contain offensive language.');
        return;
        // Handle the case where the comment is toxic
      } else {
        console.log('This message seems okay.');
        // Handle the case where the comment is not toxic
        submitForm();
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Handle errors from the API call
    }
  };

  return (
    <div>
      <form onSubmit={checkMessage}>
        <div>
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      
      {toxicityScore !== null && (
        <div>
          <h3>Toxicity Score:</h3>
          <p>{toxicityScore}</p>
        </div>
      )}
    </div>
  );
};

export default MyForm;
