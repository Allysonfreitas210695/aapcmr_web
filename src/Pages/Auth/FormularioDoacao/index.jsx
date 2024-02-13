import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Row } from 'reactstrap';

//Components
import ControlledInput from '../../../Components/ControlledInput';
import Container from '../../../Components/Container/Index';
import Content from '../../../Components/Content';
import MaskedInput from '../../../Components/MaskedInput';
import { viacep } from '../../../helpers/ViaCep';
import { ShowMessage } from '../../../helpers/ShowMessage';

//Context
import { useAuth } from '../../../Context/useAuth';
import { api_POST, api_POST_Unauthorize } from '../../../Service/api';

export default function FormularioDoacao() {
  const { showLoading } = useAuth();

  const { handleSubmit, setValue, control } = useForm({
    mode: 'onBlur'
  });

  const [cep, setCep] = useState('');
  const handleCepChange = (value) => {
    setCep(value);
  };

  const [telefone, setTelefone] = useState('');
  const handleTelefoneChange = (value) => {
    setTelefone(value);
  };

  const handleOnBlur = async (event) => {
    try {
      showLoading(true);
      const response = await viacep(event);
      showLoading(false);
      setValue('bairro', response.bairro);
      setValue('cep', response.cep);
      setValue('complemento', response.complemento);
      setValue('cidade', response.localidade);
      setValue('uf', response.uf);
      setValue('logradouro', response.logradouro);
    } catch (error) {
      ShowMessage({
        title: 'Error',
        text: 'Cep invalido!',
        icon: 'error'
      });
      return;
    } finally {
      showLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (telefone?.length > 0 && telefone.replace(/[()\-.\s_]/g, '').length < 10) {
      ShowMessage({
        title: 'Aviso',
        text: 'Númeno de telefone incorreto',
        icon: 'warning'
      });
      return;
    }

    if (data.mensageiro == false && data.deposito == false) {
      ShowMessage({
        title: 'Aviso',
        text: "Marque o modelo de envior da doação se é 'Messageiro' ou 'Deposito'",
        icon: 'warning'
      });
      return;
    }

    if (data.mensageiro == true && data.deposito == true) {
      ShowMessage({
        title: 'Aviso',
        text: "Só pode marca um, seja ele 'Messageiro' ou 'Deposito'",
        icon: 'warning'
      });
      return;
    }

    const json = {
      nomeDoador: data.nomeDoador,
      telefone: telefone.replace(/[()\-.\s_]/g, ''),
      valorDoacao: data.valor,
      dataDoacao: data.dataDoacao,
      tipoDeEnvioValor: data.mensageiro ? 'Mensageiro' : 'Depósito',
      bairro: data.bairro,
      cep: cep.replace(/[()\-.\s_]/g, ''),
      complemento: data.complemento,
      cidade: data.cidade,
      numero: data.numero,
      logradouro: data.logradouro,
      uf: data.uf,
      statusDoacao: false
    };

    try {
      showLoading(true);
      let response = await api_POST_Unauthorize('Doacao', json);
      ShowMessage(
        {
          title: 'Sucesso',
          text: 'Obrigado por sua colaboração com nosso Associação.',
          icon: 'success'
        },
        () => {
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 500);
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
      setValue('nomeDoador', '');
      setValue('bairro', '');
      setValue('valor', '');
      setCep('');
      setValue('dataDoacao', '');
      setValue('complemento', '');
      setValue('cidade', '');
      setValue('uf', '');
      setValue('numero', '');
      setValue('logradouro', '');
      setTelefone('');
      showLoading(false);
    }
  };

  return (
    <Container className={'mt-5'}>
      <Content>
        <div className="d-flex justify-content-center w-100">
          <div className="w-100">
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <Row>
                <Col sm={'12'} lg={'12'} className="text-center">
                  <img
                    src={'/images/Logo_AAPCMR.jpg'}
                    alt="logo da AAPCMR"
                    width={320}
                    height={240}
                  />
                </Col>
                <Col sm={12} lg={7}>
                  <ControlledInput
                    control={control}
                    name="nomeDoador"
                    label={
                      <>
                        <span className="text-danger">*</span> Nome do Doador
                      </>
                    }
                    type="text"
                    rules={{
                      required: true
                    }}
                  />
                </Col>
                <Col sm={12} lg={3}>
                  <MaskedInput
                    value={telefone}
                    name={'telefone'}
                    label={
                      <>
                        <span className="text-danger">*</span> Telefone
                      </>
                    }
                    onChange={handleTelefoneChange}
                    mask="(99) 9999-9999"
                  />
                </Col>
                <Col sm={12} lg={2}>
                  <ControlledInput
                    control={control}
                    name="valor"
                    label={
                      <>
                        <span className="text-danger">*</span> Valor
                      </>
                    }
                    type="number"
                    rules={{
                      required: true
                    }}
                  />
                </Col>
                <Col sm={12} lg={3}>
                  <ControlledInput
                    control={control}
                    name="dataDoacao"
                    label={
                      <>
                        <span className="text-danger">*</span> Data de Doação
                      </>
                    }
                    type="date"
                    rules={{
                      required: true
                    }}
                  />
                </Col>
                <Col sm={12} lg={3}>
                  <MaskedInput
                    value={cep}
                    name={'Cep'}
                    label={
                      <>
                        <span className="text-danger">*</span> CEP
                      </>
                    }
                    onChange={handleCepChange}
                    mask="99999-999"
                    placeholder="Digite seu CEP"
                    onBlur={handleOnBlur}
                  />
                </Col>
                <Col sm={12} lg={3}>
                  <ControlledInput
                    control={control}
                    name="bairro"
                    label={
                      <>
                        <span className="text-danger">*</span> Bairro
                      </>
                    }
                    type="text"
                    rules={{
                      required: true
                    }}
                  />
                </Col>
                <Col sm={12} lg={2}>
                  <ControlledInput
                    control={control}
                    name="numero"
                    label={
                      <>
                        <span className="text-danger">*</span> Número
                      </>
                    }
                    type="number"
                    rules={{
                      required: true
                    }}
                  />
                </Col>
                <Col sm={12} lg={1}>
                  <ControlledInput
                    control={control}
                    name="uf"
                    label={
                      <>
                        <span className="text-danger">*</span> UF
                      </>
                    }
                    type="text"
                    rules={{
                      required: true
                    }}
                  />
                </Col>
                <Col sm={12} lg={4}>
                  <ControlledInput
                    control={control}
                    name="complemento"
                    label="Complemento"
                    type="text"
                    rules={{
                      required: false
                    }}
                  />
                </Col>

                <Col sm={12} lg={5}>
                  <ControlledInput
                    control={control}
                    name="logradouro"
                    label={
                      <>
                        <span className="text-danger">*</span> Logradouro
                      </>
                    }
                    type="text"
                    rules={{
                      required: true
                    }}
                  />
                </Col>
                <Col sm={12} lg={3}>
                  <ControlledInput
                    control={control}
                    label={
                      <>
                        <span className="text-danger">*</span> Cidade
                      </>
                    }
                    name="cidade"
                    type="text"
                    rules={{
                      required: true
                    }}
                  />
                </Col>
                <Col sm={12} lg={3}>
                  <ControlledInput
                    check={true}
                    control={control}
                    label={'Mensageiro'}
                    name="mensageiro"
                    type="checkbox"
                    rules={{
                      required: false
                    }}
                  />
                </Col>
                <Col sm={12} lg={3}>
                  <ControlledInput
                    check={true}
                    control={control}
                    label={'Depósito'}
                    name="deposito"
                    type="checkbox"
                    rules={{
                      required: false
                    }}
                  />
                </Col>
                <Col sm={'12'} lg={'12'} className="text-center">
                  <Button color="success" style={{ width: '180px' }}>
                    Cadastrar Doação
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
        </div>
      </Content>
    </Container>
  );
}
