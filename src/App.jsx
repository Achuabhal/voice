// src/VoiceToText.js
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Gemini API
import { marked } from 'marked'; // Corrected import
import axios from 'axios';

export default function VoiceToText() {
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trnass, setTranscript] = useState('');
  
  const API_KEY = import.meta.env.VITE_ASSEMBLYAI_API_KEY;
  const APII_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!audioFile) {
      alert('Please select an audio file first.');
      return;
    }

    setLoading(true);
    setTranscript('');

    try {
      // Upload the audio file to AssemblyAI
      const uploadRes = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        audioFile,
        {
          headers: {
            'Authorization': API_KEY,
            'Content-Type': 'application/octet-stream'
          }
        }
      );

      const audioUrl = uploadRes.data.upload_url;

      // Request a transcription
      const transcriptRes = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        { audio_url: audioUrl },
        {
          headers: {
            'Authorization': API_KEY,
          }
        }
      );

      const transcriptId = transcriptRes.data.id;

      // Poll for transcription result
      let completed = false;
      let finalTranscript = '';

      while (!completed) {
        const pollingRes = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: { Authorization: API_KEY }
          }
        );

        if (pollingRes.data.status === 'completed') {
          finalTranscript = pollingRes.data.text;
          completed = true;
        } else if (pollingRes.data.status === 'error') {
          throw new Error('Transcription failed');
        } else {
          await new Promise((res) => setTimeout(res, 3000)); // Wait 3 sec before polling again
        }
      }

      setTranscript(finalTranscript);
      console.log(finalTranscript);

    } catch (error) {
      console.error('Error during transcription:', error);
      alert('Failed to transcribe audio.');
    }

    setLoading(false);
  };

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [data, setData] = useState('');
  const [sum, setSum] = useState('');
  const [minute, setMinute] = useState('');
  const [trans, setTrans] = useState('');
  const [q, setQ] = useState('');

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleSummarize = async () => {
    const summarizing = "Summarizing  in below 50 words...";
    setData(summarizing);
    if (trnass) {
      try {
        const genAI = new GoogleGenerativeAI(APII_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Data: ${data} this data. User: ${trnass}`;
        const result = await model.generateContent(prompt);
        const rawText = result.response.text();
        setSum(rawText);
        return marked(rawText);
      } catch (error) {
        console.error("Error fetching response from Gemini:", error);
        return "An error occurred while generating content.";
      }
    }

    try {
      const genAI = new GoogleGenerativeAI(APII_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Data: ${data} this data. User: ${transcript}`;
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      setSum(rawText);
      return marked(rawText);
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      return "An error occurred while generating content.";
    }
  };

  const handleTranscribe = async () => {
    const transcribing = "Transcribing...";
    setData(transcribing);
    console.log('Transcription saved:', transcript);
    if (trnass) {
      try {
        const genAI = new GoogleGenerativeAI(APII_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Data: ${data} this data. User: ${trnass}`;
        const result = await model.generateContent(prompt);
        const rawText = result.response.text();
        setTrans(rawText);
        return marked(rawText);
      } catch (error) {
        console.error("Error fetching response from Gemini:", error);
        return "An error occurred while generating content.";
      }
    }

    try {
      const genAI = new GoogleGenerativeAI(APII_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Data: ${data} this data. User: ${transcript}`;
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      setTrans(rawText);
      return marked(rawText);
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      return "An error occurred while generating content.";
    }
  };

  const handleMinutes = async () => {
    const summarizing = "Creating minutes...";
    setData(summarizing);
    console.log('Transcription saved:', transcript);
    if (trnass) {
      try {
        const genAI = new GoogleGenerativeAI(APII_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Data: ${data} this data. User: ${trnass}`;
        const result = await model.generateContent(prompt);
        const rawText = result.response.text();
        setMinute(rawText);
        return marked(rawText);
      } catch (error) {
        console.error("Error fetching response from Gemini:", error);
        return "An error occurred while generating content.";
      }
    }

    try {
      const genAI = new GoogleGenerativeAI(APII_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Data: ${data} this data. User: ${transcript}`;
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      setMinute(rawText);
      return marked(rawText);
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      return "An error occurred while generating content.";
    }
  };

  const handleQuizzes = async () => {
    const summarizing = "create  a quiz i need 10 questions";
    setData(summarizing);
    console.log('Transcription saved:', transcript);
    if (trnass) {
      try {
        const genAI = new GoogleGenerativeAI(APII_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Data: ${data}. User: ${trnass}`;
        const result = await model.generateContent(prompt);
        const rawText = result.response.text();
        setQ(rawText);
        return marked(rawText);
      } catch (error) {
        console.error("Error fetching response from Gemini:", error);
        return "An error occurred while generating content.";
      }
    }

    try {
      const genAI = new GoogleGenerativeAI(APII_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Data: ${data} this data. User: ${transcript}`;
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      setQ(rawText);
      return marked(rawText);
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      return "An error occurred while generating content.";
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎙️VOCALSCRIBE</h2>
      <p>Status: {listening ? 'Listening...' : 'Click start to talk'}</p>

      <div style={styles.buttonsContainer}>
        <button style={styles.button} onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>
        <button style={styles.button} onClick={() => SpeechRecognition.stopListening()}>Stop</button>
        <button style={styles.button} onClick={resetTranscript}>Reset</button>
      </div>

      <div style={styles.transcriptContainer}>
        <strong>Interim:</strong> {interimTranscript}
      </div>
      <div style={styles.transcriptContainer}>
        <strong>Final:</strong> {finalTranscript}
      </div>
      <div style={styles.transcriptContainer}>
        <strong>All:</strong> {transcript}
      </div>

      <div style={styles.fileUploadContainer}>
        <h3>📝 Upload Audio File</h3>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <br /><br />
        <button style={styles.uploadButton} onClick={handleUpload} disabled={loading || !audioFile}>
          {loading ? 'Transcribing...' : 'Upload & Transcribe'}
        </button>
      </div>

      {trnass && (
        <div style={styles.transcriptionContainer}>
          <h3>📝 Transcription:</h3>
          <p>{trnass}</p>
        </div>
      )}

      <div style={styles.processButtons}>
        <h3>Process Transcript:</h3>
        <button style={styles.button} onClick={handleSummarize}>Summarize</button>
        <button style={styles.button} onClick={handleTranscribe}>Transcribe</button>
        <button style={styles.button} onClick={handleMinutes}>Minutes</button>
        <button style={styles.button} onClick={handleQuizzes}>Quiz</button>
      </div>

      <div style={styles.resultsContainer}>
        <p><strong>Summarized Data:</strong> {sum}</p>
        <p><strong>Minutes:</strong> {minute}</p>
        <p><strong>Transcript:</strong> {trans}</p>
        <p><strong>Quiz:</strong> {q}</p>
      </div>
    </div>
  );
}

// Add some styles to enhance the look
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: 'auto'
  },
  buttonsContainer: {
    margin: '20px 0'
  },
  button: {
    padding: '10px 20px',
    margin: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  transcriptContainer: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  fileUploadContainer: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  uploadButton: {
    padding: '12px 25px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  transcriptionContainer: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  processButtons: {
    marginTop: '20px',
  },
  resultsContainer: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  }
};
