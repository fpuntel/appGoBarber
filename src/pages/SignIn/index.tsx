import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Image, Keyboard, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles';

const SignIn: React.FC = () => {
  // FormHandles - metodos disponíveis para manipular
  // useRef quando queremos manipular um elemento de forma direta
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const [showSignInButton, setShowSignInButton] = useState(true);

  const handleSignIn = useCallback((data: object) => {
    console.log(data);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setShowSignInButton(false); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowSignInButton(true); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };

  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1}}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input name="email" icon="mail" placeholder="E-mail" />

              <Input name="password" icon="lock" placeholder="Senha" />


              <Button
                onPress={ () => {
                  formRef.current?.submitForm();
              }}>
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={ () => { console.log('Deu');}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      {showSignInButton && (
        <CreateAccountButton onPress={ () => navigation.navigate('SignUp')}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
        </CreateAccountButton>
      )}
    </>
  );
}

export default SignIn;
