import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SignupBox = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 5px;
  text-align: left;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  &:hover {
    background-color: #45a049;
  }
`;

const Paragraph = styled.p`
  margin-top: 15px;
  color: #555;
`;

const Link = styled.a`
  color: #4CAF50;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Signup = ({ setIsMenuDisabled }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/signup', {
        name,
        email,
        password,
        age,
        country,
      });
      localStorage.setItem('jwt', response.data.token); // Store JWT token
      setIsMenuDisabled(false); // Re-enable navigation
      navigate('/'); // Navigate to the home page
    } catch (error) {
      alert('Error during signup, please try again.');
    }
  };

  return (
    <SignupContainer>
      <SignupBox>
        <Title>Sign Up</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name:</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Password:</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Age:</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Country of Origin:</Label>
            <Input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit">Sign Up</Button>
        </Form>
        <Paragraph>
          Already have an account? <Link href="/login">Login</Link>
        </Paragraph>
      </SignupBox>
    </SignupContainer>
  );
};

export default Signup;
