import React, { useState, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { PaperclipIcon, PaperplaneIcon } from '../../utils/Icons';

const BASE_URL = "http://localhost:5000/api/v1/";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-radius: 32px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  background: #f9f9f9;
`;

export { MessagesContainer };

const Message = styled.div`
  padding: "10px";
  margin-bottom: 10px;
  border-radius: 8px;
  background: ${({ role }) => (role === 'user' ? '#daf8e3' : '#f0f0f0')};
  align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
  max-width: 80%;
  word-wrap: break-word;

  strong {
    color: ${({ role }) => (role === 'user' ? 'blue' : 'green')};
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  background: #f1f1f1;
  border-radius: 20px;
  padding: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  outline: none;
  background: transparent;
  font-size: 16px;
`;

const FileInput = styled.input`
  display: none;
`;

const LabelWithHover = styled.label`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    color: black;
  }
`;

const FileCount = styled.div`
  margin-left: 16px;
  color: #555;
`;

const ClearButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 16px;
  &:hover {
    background-color: #d32f2f;
  }
`;

const PrintButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-top: 10px;
  align-self: flex-end;
  &:hover {
    background-color: #0056b3;
  }
`;

const Chatbot = () => {
  const [files, setFiles] = useState([]);
  const [inputValue, setInputValue] = useState('Please analyze the attached bank statements to help improve my spending habits and detect any anomalies...');
  const [messages, setMessages] = useState([
    {
      content: "Please upload your financial statements (Bank/Mobile Money statements) so our intuitive AI can analyze it for anomalies...",
      role: "bot"
    }
  ]);

  const handleFileChange = useCallback((e) => {
    setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
  }, []);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleClearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const formData = new FormData();
    formData.append('prompt', inputValue);
    files.forEach((file) => formData.append('files', file));

    try {
      const url = `${BASE_URL}${files.length > 0 ? 'chat-with-files' : 'chat'}`;
      const { data } = await axios.post(url, formData, {
        headers: { 'Content-Type': files.length > 0 ? 'multipart/form-data' : 'application/json' },
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { content: inputValue, role: 'user' },
        { content: data.message, role: 'bot' }
      ]);
      setInputValue('');
      setFiles([]);
    } catch (error) {
      console.error(error);
    }
  }, [inputValue, files]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </Message>
        ))}
      </MessagesContainer>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <InputContainer>
          <LabelWithHover htmlFor="file-upload">
            {PaperclipIcon}
          </LabelWithHover>
          <FileInput
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Message"
          />
          <LabelWithHover onClick={handleSubmit}>
            {PaperplaneIcon}
          </LabelWithHover>
        </InputContainer>
        {files.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <FileCount>{files.length} file(s) uploaded</FileCount>
            <ClearButton onClick={handleClearFiles}>Clear Files</ClearButton>
          </div>
        )}
      </form>
      <PrintButton onClick={handlePrint}>Print Chat</PrintButton>
    </ChatContainer>
  );
};

export default Chatbot;