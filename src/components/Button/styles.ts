import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warn'

interface ButtonContainerProps {
  variant: ButtonVariant
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  min-height: 3rem;
  border: 0;
  border-radius: 0.25rem;
  font-weight: bold;

  color: ${(props) => props.theme.white};
  background-color: ${(props) => props.theme['green-500']};
`
