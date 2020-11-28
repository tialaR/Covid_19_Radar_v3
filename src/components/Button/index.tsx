import React, { ReactChild } from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { ButtonChildren, Container } from './styles';

interface ButtonProps extends RectButtonProperties {
  children: any;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <ButtonChildren>{children}</ButtonChildren>
    </Container>
  );
};

export default Button;
