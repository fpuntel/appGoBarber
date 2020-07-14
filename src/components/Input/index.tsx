import React, { useEffect, useRef } from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string; // Recebe o nome do icone
}

interface inputValueReference {
  value: string;
};

const Input: React.FC<InputProps> = ({name, icon, ...rest}) => {
  const inputElementRef = useRef<any>(null);

  // pega inf do campo do formulario
  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<inputValueReference>({ value: defaultValue });

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value: string){
        inputValueRef.current.value = value;
        // muda visualmente o texto que esta dentro do input
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      }
    })
  }, [fieldName, registerField]);


  return(// Rest pega todas as propriedades
    <Container>
      <Icon name={icon} size={20} color="#666360"/>
      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onChangeText={(value) => {
          // Pega o texto digitado pelo usuario e preenchendo
          // dentro da variável criada inputV
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );

};

export default Input;
