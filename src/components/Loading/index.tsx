import React from 'react';
import { ActivityIndicator } from 'react-native';
import { colors } from '../../styles/colors';
import { Container } from './styles';

const Loading: React.FC = () => {
    return (
        <Container>
            <ActivityIndicator size='large' color={colors.primary} />
        </Container>
    );
}

export default Loading;
