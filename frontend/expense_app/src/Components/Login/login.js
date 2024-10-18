import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  text-align: left;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
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

const Login = ({ setIsMenuDisabled }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Hardcoded credentials
  const validEmail = 'matey6421@gmail.com';
  const validPassword = 'password';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === validEmail && password === validPassword) {
      // Simulate a JWT token
      const token = 'fake-jwt-token';
      localStorage.setItem('jwt', token); // Store JWT token
      setIsMenuDisabled(false); // Re-enable navigation
      navigate('/'); // Navigate to the home page
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Password:</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Login</Button>
        </Form>
        <Paragraph>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </Paragraph>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
