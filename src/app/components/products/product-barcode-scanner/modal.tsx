import { Modal, View } from 'react-native';
import { ModalContainer, ModalContent, ModalButton, ModalButtonText, ModalTitle, ModalText, ModalImage, ModalCancel } from './modal.style'
import { useState } from 'react';


type AlertModalProps = {
    cta: any
}

export default function AlertModal({ cta }: AlertModalProps) {
    const [visible, setVisible] = useState(true);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <ModalContainer>
                <ModalContent>
                    <ModalCancel>
                        <ModalButtonText onPress={() => setVisible(!visible)}>x</ModalButtonText>
                    </ModalCancel>
                    <ModalImage source={{ uri: 'https://img.nsctotal.com.br/wp-content/uploads/2022/01/gato-siames.jpg' }} />
                    <ModalTitle>Eba!</ModalTitle>
                    <ModalText>Parece que você está pronto para o pagamento!</ModalText>
                    <ModalButton onPress={() => {
                        setVisible(!visible);
                        if (cta) cta();
                    }}>
                        <ModalButtonText>Ír para o Pagamento!</ModalButtonText>
                    </ModalButton>
                </ModalContent>
            </ModalContainer>
        </ Modal>
    )
};