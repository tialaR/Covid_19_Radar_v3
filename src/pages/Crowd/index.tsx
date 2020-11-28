import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import * as Yup from 'yup';
import { colors } from '../../styles/colors';
import InformationModal from '../../components/InformationModal';
import SectionTitle from '../../components/SectionTitle';
import RadioButton from '../../components/RadioButton';
import SelectStateList from '../../components/SelectStateList';
import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErros';
import SelectDate from '../../components/SelectDate';
import { Container, ContainerRowSelects, SelectStateListAux, SelectStateListWarningText, TextButton } from './styles';
import apiCrowd from '../../service/apiCrowd';
import { getCurrentDate } from '../../utils/getCurrentDate';
import { ufsList } from '../../helpers/ufsListHelper';
import { ActivityIndicator } from 'react-native';

interface FormData {
  name: string;
}

interface InformationFeedback {
  icon: string;
  color: string;
  message: string;
  status: 'success' | 'error';
}

const Crowd: React.FC = () => {

  const navigation = useNavigation();

  const [currentState, setCurrentState] = useState<String>('');
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [currentCase, setCurrentCase] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);

  const [selectStateListWarnning, setSelectStateListWarnning] = useState(false);

  const [showInformationModal, setShowInformationModal] = useState(false);
  const [informationFeedback, setInformationFeedback] = useState<
    InformationFeedback
  >({} as InformationFeedback);

  const formRef = useRef<FormHandles>(null);

  const feedbackTryUpdated = useCallback(
    ({ icon, color, message, status }: InformationFeedback) => {
      setShowInformationModal(true);
      setInformationFeedback({
        icon,
        color,
        message,
        status,
      });
    },
    [setShowInformationModal, setInformationFeedback],
  );

  const handleInformationModalClose = useCallback(() => {
    setShowInformationModal(false);
  }, [setShowInformationModal]);

  const handleRegister = useCallback(
    async (data: FormData) => {
      setLoadingButton(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if(currentState === '') {
          setSelectStateListWarnning(true);
          return;
        }

        const formData = {
          name: data.name,
          death: currentCase,
          UF: currentState,
          date: currentDate,          
        };
        

        await apiCrowd.post('/case', formData);

        feedbackTryUpdated({
          status: 'success',
          color: colors.primary,
          icon: 'done',
          message: 'Registro realizado com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const erros = getValidationErrors(err);
          formRef.current?.setErrors(erros);

          return;
        }

        feedbackTryUpdated({
          status: 'error',
          color: colors.primary,
          icon: 'error-outline',
          message:
            'Ocorreu um erro ao realizar o registro, tente novamente.',
        });
      }

      setLoadingButton(false);
    },
    [navigation, currentCase, currentState, currentDate, setSelectStateListWarnning],
  );

  const handleChoiceTypeCase = useCallback((caseType: string) => {
    const caseTypeAux = caseType === 'Óbito' ? true : false;
    setCurrentCase(caseTypeAux);
  }, [setCurrentCase]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Container>

          <SectionTitle
            sectionTitleStyles={{ marginTop: 20 }}
            title="Registrar caso de infeção ou óbito"
          />

          <Form
            initialData={{ name: '' }}
            ref={formRef}
            onSubmit={handleRegister}
          >
            <Input
              autoCapitalize="words"
              name="name"
              icon="person"
              placeholder="Nome completo"
              returnKeyType="next"
            />

            <ContainerRowSelects>
              <SelectStateListAux>
                <SelectStateList
                  onStatePress={(state: String) => setCurrentState(state)}
                  list={ufsList}
                  firstValue='Estado'
                />
                {selectStateListWarnning &&
                  <SelectStateListWarningText>
                    Estado obrigatório
                  </SelectStateListWarningText>
                }
              </SelectStateListAux>
              <RadioButton 
                textOne='Infeção'
                textTwo='Óbito'
                onRadioSelect={(choice: string) => handleChoiceTypeCase(choice)}
              />
            </ContainerRowSelects>

            <SelectDate
              onSelectDate={(date: string) => setCurrentDate(date)}
            />
            
            <Button onPress={() => formRef.current?.submitForm()}>
              <>
              {loadingButton ? 
                <ActivityIndicator size='small' color={colors.white} />
                :
                <TextButton>Registrar</TextButton>
              }
              </>
            </Button>
          </Form>
        </Container>
      </KeyboardAvoidingView>

      <InformationModal
        isVisible={showInformationModal}
        information={informationFeedback.message}
        icon={informationFeedback.icon}
        iconColor={informationFeedback.color}
        showModal={handleInformationModalClose}
      />
    </>
  );
};

export default Crowd;
