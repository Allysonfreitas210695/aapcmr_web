//Pages
import Home from "../Pages/Admin/Home";
import Paciente from "../Pages/Admin/Paciente";
import RelatorioPaciente from "../Pages/Admin/RelatorioPaciente";

//Icons
import { FaHome, FaUser } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { FaFileContract } from "react-icons/fa";
import Usuarios from "../Pages/Admin/Usuarios";


export const AdminRoutes = [
  {
    path: "/admin/home",
    element: <Paciente />,
    name: "Cadastro de Paciente",
    icon: FaHome
  },
  {
    path: "/admin/relatorio",
    element: <RelatorioPaciente />,
    name: "Relatorio Mesal",
    icon: FaFileContract
  },
  {
    path: "/admin/usuarioAdm",
    element: <Usuarios />,
    name: "Usuário",
    icon: FaUser
  }
];