//Pages
import AcoesApoio from "../Pages/Admin/AcoesApoio";
import MovimentacaoGasto from "../Pages/Admin/MovimentacaoGasto";
import Paciente from "../Pages/Admin/Paciente";
import RelatorioPaciente from "../Pages/Admin/RelatorioPaciente";
import Usuarios from "../Pages/Admin/Usuarios";

//Icons
import { FaUserFriends, FaUsersCog } from "react-icons/fa";
import { FaFileContract } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { RiMoneyDollarBoxLine } from "react-icons/ri";


export const AdminRoutes = [
  {
    path: "/admin/home",
    element: <Paciente />,
    name: "Cadastro de Paciente",
    icon: FaUserFriends
  },
  {
    path: "/admin/usuarioAdm",
    element: <Usuarios />,
    name: "Cadastro de Usuário",
    icon: FaUsersCog
  },
  {
    path: "/admin/relatorio",
    element: <RelatorioPaciente />,
    name: "Relatorio Mesal",
    icon: FaFileContract
  },
  {
    path: "/admin/acoesApoio",
    element: <AcoesApoio />,
    name: "Cadastro de Ações Apoio",
    icon: FaBookOpen
  },
  {
    path: "/admin/movimentacaoGasto",
    element: <MovimentacaoGasto />,
    name: "Cadastro de Movimentação",
    icon: RiMoneyDollarBoxLine
  },
];