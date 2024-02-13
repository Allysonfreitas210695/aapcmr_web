import React from 'react';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

//Components
import Container from '../../../Components/Container/Index';
import Content from '../../../Components/Content';
import ControlledInput from '../../../Components/ControlledInput';

//Context
import { useAuth } from '../../../Context/useAuth';

//Helpers
import { ShowMessage } from '../../../helpers/ShowMessage';

//Service
import { api_POST_Unauthorize } from '../../../Service/api';

export default function EsqueceuSenha() {
  const { showLoading } = useAuth();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    if (!data.email || data.email.trim() === '') {
      ShowMessage({
        title: 'Aviso',
        text: 'Por favor, Informe o email.',
        icon: 'warning'
      });
      return;
    }
    showLoading(true);
    let { email } = data;

    try {
      await api_POST_Unauthorize(`Usuario/EsqueceuSenha/${email}`);
      ShowMessage(
        {
          title: 'Sucesso',
          text: 'Por favor, verfique seu email.',
          icon: 'success'
        },
        () => {
          setTimeout(() => {
            navigate('/auth/login');
          }, 2000);
        }
      );
    } catch (error) {
      ShowMessage({
        title: 'Error',
        text: error?.message ?? 'Erro na Operação',
        icon: 'error'
      });
      return;
    } finally {
      showLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <div className="d-flex justify-content-center w-100">
          <div className="d-none d-sm-block w-50">
            <img src={'/images/Logo_AAPCMR.jpg'} alt="logo da AAPCMR" width={'100%'} />
          </div>
          <div className="w-50">
            <h1 className="mt-4 mb-4 text-center">Informe seu email</h1>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <Row>
                <Col sm={'12'} lg={'12'}>
                  <ControlledInput
                    control={control}
                    className={'mb-2'}
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
                  <FormGroup>
                    <Label>
                      <span
                        className="text-primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/auth/login')}
                      >
                        Voltar <FaArrowLeft />
                      </span>
                    </Label>
                  </FormGroup>
                </Col>
                <Col Col className="text-center">
                  <FormGroup className="text-center">
                    <Button color="success" style={{ width: '180px' }}>
                      ENVIAR
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </form>
          </div>
        </div>
      </Content>
    </Container>
  );
}
