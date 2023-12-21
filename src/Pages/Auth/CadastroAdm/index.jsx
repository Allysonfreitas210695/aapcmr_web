import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

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
import { FaArrowLeft } from 'react-icons/fa';

export default function CadastroAdm() {
    const { showLoading } = useAuth();
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
    } = useForm({
        mode: 'onBlur'
    });

    const onSubmit = async (data) => {
        if (data.senha !== data.confirmeSenha) {
            ShowMessage({
                title: 'Aviso',
                text: 'As senhas não coincidem! Por favor, digite a mesma senha para confirmação.',
                icon: 'warning'
            });
            return;
        }
        showLoading(true);
        let { nome, email, senha } = data;

        try {
            await api_POST_Unauthorize("Usuario", { nome, email, senha });
            ShowMessage({
                title: 'Sucesso',
                text: 'Por favor, verfique seu email.',
                icon: 'success'
            }, () => { setTimeout(() => { navigate('/auth/login') }, 2000) });

        } catch (error) {
            ShowMessage({
                title: 'Error',
                text: error?.message ?? "Erro na Operação",
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
                <div className='d-flex justify-content-center w-100'>
                    <div className='d-none d-sm-block w-50'> 
                        <img
                            src={"/images/Logo_AAPCMR.jpg"}
                            alt="logo da AAPCMR"
                            width={"100%"}
                        />
                    </div>
                    <div className='w-50'>
                        <h1 className='mt-4 mb-2 text-center'>Cadastre-se</h1>
                        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                            <Row>
                                <Col lg={"12"} sm={"12"}>
                                    <ControlledInput
                                        control={control}
                                        name='nome'
                                        label='Nome'
                                        type='text'
                                        rules={{
                                            required: true
                                        }}
                                    />
                                </Col>
                                <Col lg={"12"} sm={"12"}>
                                    <ControlledInput
                                        control={control}
                                        name='email'
                                        label='Email'
                                        type='email'
                                        rules={{
                                            required: true,
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                message: 'Endereço de e-mail inválido',
                                            },
                                        }}
                                    />
                                </Col>

                                <Col lg={"6"} sm={"12"}>
                                    <ControlledInput
                                        control={control}
                                        name='senha'
                                        label='senha'
                                        type='password'
                                        rules={{
                                            required: true,
                                            minLength: {
                                                value: 6,
                                                message: 'A senha deve ter no mínimo 6 caracteres'
                                            }
                                        }}
                                    />
                                </Col>

                                <Col lg={"6"} sm={"12"}>
                                    <ControlledInput
                                        control={control}
                                        name='confirmeSenha'
                                        label='Confirme sua senha'
                                        type='password'
                                        rules={{
                                            required: true,
                                            minLength: {
                                                value: 6,
                                                message: 'A senha deve ter no mínimo 6 caracteres'
                                            }
                                        }}
                                    />
                                </Col>
                                <Col sm={"12"} lg={"12"}>
                                    <FormGroup>
                                        <Label>
                                            <span className='text-primary' style={{cursor: "pointer"}} onClick={() => navigate("/auth/login")}>
                                                Voltar <FaArrowLeft />
                                            </span>
                                        </Label>
                                    </FormGroup>
                                </Col>

                                <Col lg={"12"} sm={"12"} className='text-center'>
                                    <FormGroup className='text-center'>
                                        <Button color='success' style={{ width: '180px' }}>
                                            CADASTRAR
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
                    </div>
                </div>
            </Content>
        </Container >
    );
};

