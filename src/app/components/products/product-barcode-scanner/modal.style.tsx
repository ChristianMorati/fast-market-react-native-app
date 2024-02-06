import styled from 'styled-components/native';
import { Modal } from 'react-native';

export const ModalContainer = styled.View`
  position: absolute; /* Define a posição absoluta */
  width: 100%; /* Define a largura como 100% da tela */
  height: 100%; /* Define a altura como 100% da tela */
  justify-content: center;
  align-content: center;
  background-color: rgba(0, 0, 0, .8);
`;

export const ModalDark = styled(Modal)`
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
`;

export const ModalContent = styled.View`
  background-color: #121212;
  border-radius: 10px;
  padding: 15px;
  margin: 20px auto;
  width: 80%;
  border: 1px solid #2e2e2e;
`;

export const ModalImage = styled.Image`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 5px 5px 3px 3px;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-top: 10px;
`;

export const ModalText = styled.Text`
  font-size: 14px;
  color: #ccc;
  margin-bottom: 16px;
`;

export const ModalButton = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 5px;
  background-color: #6d166d;
  `;

export const ModalButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  align-self: center;
  font-weight: bold;
`;

export const ModalCancel = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
  border-radius: 5px;
  padding: 5px 10px 5px 10px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  background-color: red;
`;
