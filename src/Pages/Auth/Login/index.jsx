import React, { useState } from 'react';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// Components
import Container from '../../../Components/Container/Index';
import Content from '../../../Components/Content';
import ControlledInput from '../../../Components/ControlledInput';

//Context
import { useAuth } from '../../../Context/useAuth';

//Helpers
import { ShowMessage } from '../../../helpers/ShowMessage';
import { ModalCustom } from '../../../Components/Modal';
import { FaRegWindowClose } from 'react-icons/fa';

export default function Login() {
  const { logIn } = useAuth();

  //State para controlar modal
  const [isOpenModal, setIsOpenModal] = useState(true);

  const togglemodal = () => setIsOpenModal(!isOpenModal);

  const { handleSubmit, control } = useForm({
    mode: 'onBlur'
  });

  const navigate = useNavigate();

  const handleRedirectCadastro = () => {
    navigate('/auth/cadastroADM');
  };

  const handleRedirectEsqueceuSenha = () => {
    navigate('/auth/esqueceuSenha');
  };

  const onSubmit = async (data) => {
    try {
      await logIn(data);
      ShowMessage(
        {
          title: 'Sucesso',
          text: 'Operação realizada com sucesso.',
          icon: 'success'
        },
        () => {
          navigate('/admin/home');
        }
      );
    } catch (e) {
      ShowMessage({ title: 'Error', text: e.message, icon: 'error' });
    }
  };

  return (
    <>
      <ModalCustom
        isOpen={isOpenModal}
        toggle={togglemodal}
        size={'ms'}
        invisibleButtons={false}
      >
        <Row>
          <Col sm={12} lg={12}>
            <h2>Seja Bem-Vindo,</h2>
            <h5>
              Se você é um doador, por favor clique{' '}
              <span
                className="text-primary"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/auth/formulario')}
              >
                aqui
              </span>{' '}
              para contribuir.
            </h5>
          </Col>
        </Row>
      </ModalCustom>
      <Container>
        <Content>
          <div className="d-flex justify-content-center w-100">
            <div className="d-none d-sm-block w-50">
              <img
                src={'/images/Logo_AAPCMR.jpg'}
                alt="logo da AAPCMR"
                width={'100%'}
              />
            </div>
            <div className="w-50">
              <h1 className="mt-4 mb-2 text-center">Login</h1>
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <Row>
                  <Col sm={'12'} lg={'12'}>
                    <ControlledInput
                      control={control}
                      name="email"
                      label="Email"
                      type="email"
                      rules={{
                        required: true,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Endereço de e-mail inválido'
                        }
                      }}
                    />
                  </Col>
                  <Col sm={'12'} lg={'12'}>
                    <ControlledInput
                      control={control}
                      name="senha"
                      label="Senha"
                      type="password"
                      rules={{
                        required: true,
                        minLength: {
                          value: 6,
                          message: 'A senha deve ter no mínimo 6 caracteres'
                        }
                      }}
                    />
                  </Col>

                  <Col sm={'12'} lg={'12'}>
                    <FormGroup>
                      <Label>
                        <span>
                          Esqueceu sua senha? Recupere-a{' '}
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={handleRedirectEsqueceuSenha}
                            className="text-primary"
                          >
                            aqui.
                          </span>
                        </span>
                      </Label>
                    </FormGroup>
                  </Col>

                  <Col sm={'12'} lg={'12'} className="text-center">
                    <FormGroup className="text-center">
                      <Button color="primary" style={{ width: '180px' }}>
                        ACESSAR
                      </Button>
                    </FormGroup>
                  </Col>

                  <Col sm={'12'} lg={'12'}>
                    <FormGroup className="mt-4">
                      <Label>
                        <span>
                          Cadastre-se{' '}
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={handleRedirectCadastro}
                            className="text-primary"
                          >
                            aqui.
                          </span>
                        </span>
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
        </Content>
      </Container>
    </>
  );
}
