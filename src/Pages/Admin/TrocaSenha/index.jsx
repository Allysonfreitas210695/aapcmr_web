import React from 'react';
import { FaRegSave } from 'react-icons/fa';
import { Button, Col, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';

//Components
import ControlledInput from '../../../Components/ControlledInput';

//Helpers
import { ShowMessage } from '../../../helpers/ShowMessage';

//Services
import { api_POST } from '../../../Service/api';

//Context
import { useAuth } from '../../../Context/useAuth';

export default function TrocaSenha() {
  const { showLoading, session } = useAuth();

  const { handleSubmit, control, setValue } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    if (data.senhaNova !== data.confirmaSenhaNova) {
      ShowMessage({
        title: 'Error',
        text: 'você precisa colocar a mesma senha ao confirma.',
        icon: 'error'
      });
      return;
    }

    try {
      showLoading(true);
      let response = await api_POST(
        `Usuario/TrocaSenha/${session.id}/${data.senhaAntiga}/${data.senhaNova}`
      );
      ShowMessage({
        title: 'Sucesso',
        text: 'Sucesso na operação.',
        icon: 'success'
      });
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm={12} lg={12} className="mb-4">
          <h5>Troca de Senha</h5>
        </Col>
        <Col sm={12} lg={3}>
          <ControlledInput
            control={control}
            name="senhaAntiga"
            label={
              <>
                <span className="text-danger">*</span> Senha Antiga
              </>
            }
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
        <Col sm={12} lg={3}>
          <ControlledInput
            control={control}
            name="senhaNova"
            label={
              <>
                <span className="text-danger">*</span> Senha Nova
              </>
            }
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
        <Col sm={12} lg={3}>
          <ControlledInput
            control={control}
            name="confirmaSenhaNova"
            label={
              <>
                <span className="text-danger">*</span> Confirme Senha
              </>
            }
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
        <Col sm={12} lg={3} className="mt-2">
          <br />
          <Button color={'success'} className="w-100">
            <FaRegSave /> Salvar
          </Button>
        </Col>
      </Row>
    </form>
  );
}
