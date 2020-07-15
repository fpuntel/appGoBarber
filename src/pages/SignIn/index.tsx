import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Image,
  Keyboard,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles';

interface SignInFormData{
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  // FormHandles - metodos disponíveis para manipular
  // useRef quando queremos manipular um elemento de forma direta
  // ref - maneira de acessar um elemento de forma mais direta
  const formRef = useRef<FormHandles>(null);

  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const { signIn } = useAuth();

  const [showSignInButton, setShowSignInButton] = useState(true);


  const handleSignIn = useCallback(
    async (data: SignInFormData) => {  // eslint-disable-line
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      // abortEarly : true retorna todos os erros
      // não somente o primeiro
      await schema.validate(data, {
        abortEarly: false,
      });

      // Depois da validação chama o método para SignIn
      // Passa as informações necessárias para o SignIn
      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      // disparar um alerta
      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, cheque suas credenciais.'
      );
    }
  },
  [signIn],
  );


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
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                // next - ir para o próximo input
                returnKeyType="next"
                onSubmitEditing={() =>{
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                //returnKeyType tipo do retorno
                // no teclado

                // onSubmitEditing funcao para
                // quando o usuário clicar no botão do teclado
                // submit
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

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
