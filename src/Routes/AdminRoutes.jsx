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
import TrocaSenha from "../Pages/Admin/TrocaSenha";


export const AdminRoutes = [
  {
    path: "/admin/home",
    element: <Dashboard />,
    name: "Dashboard",
    icon: BiSolidDashboard,
    sidebar: true
  },
  {
    path: "/admin/controlePaciente",
    element: <Paciente />,
    name: "Controle de Pacientes",
    icon: FaUserFriends,
    sidebar: true
  },
  {
    path: "/admin/consultaPaciente",
    element: <ConsultaPaciente />,
    name: "Consulta Paciente",
    icon: FaSearch,
    sidebar: true
  },
  {
    path: "/admin/usuarioAdm",
    element: <Usuarios />,
    name: "Controle de Usuários",
    icon: FaUsersCog,
    sidebar: true
  },
  {
    path: "/admin/relatorio",
    element: <RelatorioPaciente />,
    name: "Relatório Mensal",
    icon: FaFileContract,
    sidebar: true
  },
  {
    path: "/admin/acaoApoio",
    element: <AcoesApoio />,
    name: "Cadastro Ações de Apoio",
    icon: FaBookOpen,
    sidebar: true
  },
  {
    path: "/admin/acaoApoioSemanal",
    element: <AcaoSemanal />,
    name: "Ações de Apoio Semanais",
    icon: FaCalendarAlt,
    sidebar: true
  },
  {
    path: "/admin/tiposGasto",
    element: <TiposGasto />,
    name: "Cadastro de Tipo de Gastos",
    icon: RiMoneyDollarBoxLine,
    sidebar: true
  },
  {
    path: "/admin/trocaSenha",
    element: <TrocaSenha />,
    name: "Troca de Senha",
    icon: RiMoneyDollarBoxLine,
    sidebar: false
  },
];
