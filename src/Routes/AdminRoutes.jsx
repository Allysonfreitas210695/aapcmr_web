//Pages
import AcoesApoio from "../Pages/Admin/AcoesApoio";
import Paciente from "../Pages/Admin/Paciente";
import RelatorioPaciente from "../Pages/Admin/RelatorioPaciente";
import Usuarios from "../Pages/Admin/Usuarios";
import TiposGasto from "../Pages/Admin/TiposGasto";
import ConsultaPaciente from "../Pages/Admin/ConsultaPaciente";
import Dashboard from "../Pages/Admin/Dashboard";
import AcaoSemanal from "../Pages/Admin/AcaoSemanal";

//Icons
import { FaUserFriends, FaUsersCog, FaFileContract, FaBookOpen, FaSearch } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";


export const AdminRoutes = [
  {
    path: "/admin/home",
    element: <Dashboard />,
    name: "Dashboard",
    icon: BiSolidDashboard
  },
  {
    path: "/admin/controlePaciente",
    element: <Paciente />,
    name: "Controle de Pacientes",
    icon: FaUserFriends
  },
  {
    path: "/admin/consultaPaciente",
    element: <ConsultaPaciente />,
    name: "Consulta Paciente",
    icon: FaSearch
  },
  {
    path: "/admin/usuarioAdm",
    element: <Usuarios />,
    name: "Controle de Usuários",
    icon: FaUsersCog
  },
  {
    path: "/admin/relatorio",
    element: <RelatorioPaciente />,
    name: "Relatório Mensal",
    icon: FaFileContract
  },
  {
    path: "/admin/acaoApoio",
    element: <AcoesApoio />,
    name: "Cadastro Ações de Apoio",
    icon: FaBookOpen
  },
  {
    path: "/admin/acaoApoioSemanal",
    element: <AcaoSemanal />,
    name: "Ações de Apoio Semanais",
    icon: FaCalendarAlt
  },
  {
    path: "/admin/tiposGasto",
    element: <TiposGasto />,
    name: "Cadastro de Tipo de Gastos",
    icon: RiMoneyDollarBoxLine
  },
];
