import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Row } from 'reactstrap'
import { useReactToPrint } from 'react-to-print';
import { FaArrowLeft } from 'react-icons/fa6'
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import moment from 'moment';

//Helpers
import { mascaraCPF } from '../../../../helpers/ValidadacaoDocumentos';
import { ShowMessage } from '../../../../helpers/ShowMessage';

//Context
import { useAuth } from '../../../../Context/useAuth';

//Service
import { api_GET } from '../../../../Service/api';

//CSS
import "./Fichapaciente.css"

export default function FichaPaciente({ id, handleVoltar }) {
  const { showLoading } = useAuth();

  const [paciente, setPaciente] = useState(null);

  //Referencia para o componente de impressão
  const ref = useRef(null);

  const loadPaciente = async (id) => {
    showLoading(true);
    try {
      let response = await api_GET(`Paciente/${id}`);
      const { data } = response;
      setPaciente(data);
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
  }

  useEffect(() => {
    if (id != null)
      loadPaciente(id)
    else {
      ShowMessage({
        title: 'Error',
        text: "Erro na Operação",
        icon: 'error'
      });
      return;
    }
  }, []);

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: "Relatório_paciente",
    copyStyles: true,
  });

  return (
    <>
      <div className='mb-2 d-flex justify-content-between align-items-center'>
        <Button color='danger' className='text-white px-4' onClick={() => handlePrint()}>
          <BsFileEarmarkPdfFill color='#fff' /> PDF
        </Button>
        <Button color='secondary' className='text-white' onClick={() => handleVoltar()}>
          <FaArrowLeft color='#fff' /> Voltar
        </Button>
      </div>
      <div className='bg-white p-3 rounded shadow'>
        <div className='bw-bold d-flex justify-content-center align-items-start flex-column mb-2 body' ref={ref}>
          <div className='d-flex justify-content-center align-items-center w-100 header'>
            <div className='text-center'>
              <img src={"/images/Logo_AAPCMR.jpg"} width={220} alt="logo do sistema" />
            </div>
          </div>
          <h2>Registro do Paciente</h2>
          <h5 style={{ color: "#666" }}> {paciente?.nome ?? ""}</h5>
          <div className='mt-2 w-100 content'>
            <h5 className='d-flex align-items-center justify-content-between' style={{ borderBottom: "1px solid #ccc" }}>Dados do Paciente</h5>
            <Row className='px-1 py-2'>
              <Col md="12" lg="4" className='mb-2'>
                <span className="fw-bold" >Nome: </span> {paciente?.nome ?? ""}
              </Col>
              <Col md="12" lg="4" className='mb-2'>
                <span className="fw-bold" >CPF: </span> {!!paciente?.cpf ? mascaraCPF(paciente?.cpf) : ""}
              </Col>
              <Col md="12" lg="4" className='mb-2'>
                <span className="fw-bold" >Estado civil: </span> {paciente?.statusCivil ?? ""}
              </Col>
              <Col md="12" lg="4" className='mb-2'>
                <span className="fw-bold" >Naturalidade: </span> {paciente?.naturalidade ?? ""}
              </Col>
              <Col md="12" lg="4" className='mb-2'>
                <span className="fw-bold" >Data de Nascimento: </span> {paciente?.dataNascimento != null ? moment(paciente?.dataNascimento).format("DD/MM/YYYY") : ""}
              </Col>
              <Col md="12" lg="4" className='mb-2'>
                <span className="fw-bold" >Recebe Cesta Básica? </span> {paciente?.cestaBasica ? "Sim" : "Não"}
              </Col>
              <Col md="12" lg="6" className='mb-2'>
                <span className="fw-bold" >Número SUS: </span> {(paciente?.susNumero != '') ? paciente?.susNumero : "Não Informado"}
              </Col>
            </Row>
          </div>

          <div className='mt-2 w-100 content'>
            <h5 className='d-flex align-items-center justify-content-between' style={{ borderBottom: "1px solid #ccc" }}>Situação habitacional</h5>
            {paciente?.situacaoHabitacional != null &&
                <Row className='px-1 py-2'>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Casa: </span> {paciente?.situacaoHabitacional?.casa ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Moradia: </span> {paciente?.situacaoHabitacional?.moradia ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Transporte: </span> {paciente?.situacaoHabitacional?.transporte ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >CEP: </span> {paciente?.situacaoHabitacional?.cep?.replace(/^(\d{5})(\d)/, '$1-$2') ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Bairro: </span> {paciente?.situacaoHabitacional?.bairro ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Numero: </span> {paciente?.situacaoHabitacional?.numero ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Complemento: </span> {paciente?.situacaoHabitacional?.complemento ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Cidade: </span> {paciente?.situacaoHabitacional?.cidade ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Logradouro: </span> {paciente?.situacaoHabitacional?.logradouro ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >UF: </span> {paciente?.situacaoHabitacional?.uf ?? ""}
                  </Col>
                </Row>
            }
          </div>

          <div className='mt-2 w-100 content'>
            <h5 className='d-flex align-items-center justify-content-between ' style={{ borderBottom: "1px solid #ccc" }}>Composição Familiar</h5>
            {paciente?.composicaoFamiliares?.length > 0 &&
              paciente?.composicaoFamiliares?.map((value, index) => (
                <Row className='px-1 py-2' key={index}>
                  <Col md="12" lg="12" className='mb-2'>
                    <span className="fw-bold" >Familiar({index + 1}):</span>
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Nome: </span> {value?.nomeFamiliar ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Idade: </span> {value?.idadeFamiliar ?? ""} Anos
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Vinculo: </span> {value?.vinculoFamiliar ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Renda: </span> {value?.renda?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? ""}
                  </Col>
                </Row>
              ))
            }
          </div>

          <div className='mt-2 w-100 content'>
            <h5 className='d-flex align-items-center justify-content-between' style={{ borderBottom: "1px solid #ccc" }}>Tratamentos do Paciente</h5>
            {paciente?.tratamentoPacientes?.length > 0 &&
              paciente?.tratamentoPacientes?.map((value, index) => (
                <Row className='px-1 py-2' key={index}>
                  <Col md="12" lg="12" className='mb-2'>
                    <span className="fw-bold" >Tratamento({index + 1}):</span>
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Diagnostico: </span> {value?.diagnostico ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Ano do Diagnostico: </span> {value?.anoDiagnostico ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Status do Tratamento: </span> {value?.statusTratamento ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Médico: </span> {value?.medico ?? ""}
                  </Col>
                  <Col md="12" lg="4" className='mb-2'>
                    <span className="fw-bold" >Tipo da Cirurgia: </span> {value?.tipoCirurgia ?? ""}
                  </Col>
                </Row>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
