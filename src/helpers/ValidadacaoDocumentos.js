export const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

  if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
    return false; // CPF deve ter 11 dígitos e não pode ter todos os números iguais
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(9, 10))) {
    return false;
  }

  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(10, 11))) {
    return false;
  }

  return true;
};

export const validarRG = (rg) => {
  if (!rg || typeof rg !== 'string') {
    return false;
  }

  rg = rg.replace(/[^\d]/g, '');

  return rg.length === 9 && /^\d{9}$/.test(rg);
};

export const mascaraCNPJ = (v) => {
  v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
  v = v.replace(/^(\d{2})(\d)/, '$1.$2'); //Coloca ponto entre o segundo e o terceiro dígitos
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); //Coloca ponto entre o quinto e o sexto dígitos
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2'); //Coloca uma barra entre o oitavo e o nono dígitos
  v = v.replace(/(\d{4})(\d)/, '$1-$2'); //Coloca um hífen depois do bloco de quatro dígitos
  return v;
};

export const mascaraCPF = (v) => {
  v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
  v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
  v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
  //de novo (para o segundo bloco de números)
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
  return v;
};

export const mascaraTelefone = (v) => {
  // Remove caracteres não numéricos
  const numeroLimpo = v.replace(/\D/g, '');
  // Aplica a máscara para telefone (9 ou 10 dígitos)
  const regex = /^(\d{2})(\d{4,5})(\d{4})$/;
  const resultado = numeroLimpo.replace(regex, '($1) $2-$3');

  return resultado;
};
