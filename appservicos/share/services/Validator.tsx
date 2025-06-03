import moment from 'moment';
import {RetornoDTO} from '../models/objects/RetornoDTO';
import {DateUtils} from './DateUtils';

export class Validator {

  static validaDataNascimento(date: string | Date): RetornoDTO {
    if (new Date(date).getTime() < moment().subtract(130, 'years').toDate().getTime()) {
      return new RetornoDTO().construtorComErro('Data de Nascimento deve ser superior a ' + DateUtils.formatDateToBr(moment().subtract(130, 'years').toDate().toISOString()) + '.');
    }
    if (this.validaDataPassadoOuPresente(date).error) {
      return new RetornoDTO().construtorComErro('Data de Nascimento deve ser inferior a ' + DateUtils.formatDateToBr(moment().toDate().toISOString()) + '.');
    }
    return new RetornoDTO();
  }

  static validaMinimo(value: string, min: number): RetornoDTO {
    if (value && value.length < min) {
      return new RetornoDTO().construtorComErro('O mínimo para este campo é de ' + min + ' caractere(s).');
    }
    return new RetornoDTO();
  }

  static validaValorMinimo(value: string, min: number): RetornoDTO {
    if (parseFloat(value) < min) {
      return new RetornoDTO().construtorComErro('O valor mínimo para este campo é ' + min + '.');
    }
    return new RetornoDTO();
  }

  static validaValorMaximo(value: string, min: number): RetornoDTO {
    if (parseFloat(value) > min) {
      return new RetornoDTO().construtorComErro('O valor máximo para este campo é ' + min + '.');
    }
    return new RetornoDTO();
  }

  static validaMinimoArray(value: [any], min: number): RetornoDTO {
    if (value && value.length < min) {
      return new RetornoDTO().construtorComErro('A quantidade mínima do campo é de ' + min + ' itens.');
    }
    return new RetornoDTO();
  }

  static validaMaximaArray(value: [any], max: number): RetornoDTO {
    if (value && value.length > max) {
      return new RetornoDTO().construtorComErro('A quantidade máxima do campo é de ' + max + ' itens.');
    }
    return new RetornoDTO();
  }

  static validaCpf(cpf: string): RetornoDTO {
    if (cpf) {
      var numeros, digitos, soma, i, resultado, digitos_iguais;
      digitos_iguais = 1;
      if (cpf.length < 11) {
        return new RetornoDTO().construtorComErro('O CPF informado é inválido.');
      }
      for (i = 0; i < cpf.length - 1; i++) {
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
          digitos_iguais = 0;
          break;
        }
      }
      if (!digitos_iguais) {
        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--) {
          soma += Number(numeros.charAt(10 - i)) * i;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Number(digitos.charAt(0))) {
          return new RetornoDTO().construtorComErro('O CPF informado é inválido.');
        }
        numeros = cpf.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--) {
          soma += Number(numeros.charAt(11 - i)) * i;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Number(digitos.charAt(1))) {
          return new RetornoDTO().construtorComErro('O CPF informado é inválido.');
        }
        return new RetornoDTO();
      } else {
        return new RetornoDTO().construtorComErro('O CPF informado é inválido.');
      }
    } else {
      return new RetornoDTO();
    }
  }

  static validaDataPassadoOuPresente(date: string | Date, exibeHora = false): RetornoDTO {
    if (new Date(date).getTime() > moment().toDate().getTime()) {
      if (exibeHora) {
        return new RetornoDTO().construtorComErro('Data deve ser igual ou inferior a ' + DateUtils.formatDateTimeToBr(moment().toDate()) + '.');
      } else {
        return new RetornoDTO().construtorComErro('Data deve ser igual ou inferior a ' + DateUtils.formatDateToBr(moment().toDate().toISOString()) + '.');
      }
    }
    return new RetornoDTO();
  }

  static validaCns(cns: string): RetornoDTO {
    if (cns) {
      if (cns.trim().length !== 15) {
        return new RetornoDTO().construtorComErro('CNS inválido.');
      }

      if (cns.startsWith("1") || cns.startsWith("2")) {
        let soma, resto, dv: number;
        let pis = "", resultado = "";
        pis = cns.substring(0, 11);


        soma = (Number.parseInt(pis.substring(0, 1)) * 15) +
          (Number.parseInt(pis.substring(1, 2)) * 14) +
          (Number.parseInt(pis.substring(2, 3)) * 13) +
          (Number.parseInt(pis.substring(3, 4)) * 12) +
          (Number.parseInt(pis.substring(4, 5)) * 11) +
          (Number.parseInt(pis.substring(5, 6)) * 10) +
          (Number.parseInt(pis.substring(6, 7)) * 9) +
          (Number.parseInt(pis.substring(7, 8)) * 8) +
          (Number.parseInt(pis.substring(8, 9)) * 7) +
          (Number.parseInt(pis.substring(9, 10)) * 6) +
          (Number.parseInt(pis.substring(10, 11)) * 5);

        resto = soma % 11;
        dv = 11 - resto;

        if (dv == 11) {
          dv = 0;
        }

        //3º teste
        if (dv == 10) {
          soma += 2;

          resto = soma % 11;
          dv = 11 - resto;
          resultado = pis + "001" + dv.toString();
        } else {
          resultado = pis + "000" + dv.toString();
        }

        if (cns !== resultado) {
          return new RetornoDTO().construtorComErro('CNS inválido.');
        } else {
          return new RetornoDTO();
        }
      }

      if (cns.startsWith("7") || cns.startsWith("8") || cns.startsWith("9")) {
        let soma, resto: number;

        soma = (Number.parseInt(cns.substring(0, 1)) * 15) +
          (Number.parseInt(cns.substring(1, 2)) * 14) +
          (Number.parseInt(cns.substring(2, 3)) * 13) +
          (Number.parseInt(cns.substring(3, 4)) * 12) +
          (Number.parseInt(cns.substring(4, 5)) * 11) +
          (Number.parseInt(cns.substring(5, 6)) * 10) +
          (Number.parseInt(cns.substring(6, 7)) * 9) +
          (Number.parseInt(cns.substring(7, 8)) * 8) +
          (Number.parseInt(cns.substring(8, 9)) * 7) +
          (Number.parseInt(cns.substring(9, 10)) * 6) +
          (Number.parseInt(cns.substring(10, 11)) * 5) +
          (Number.parseInt(cns.substring(11, 12)) * 4) +
          (Number.parseInt(cns.substring(12, 13)) * 3) +
          (Number.parseInt(cns.substring(13, 14)) * 2) +
          (Number.parseInt(cns.substring(14, 15)) * 1);


        resto = soma % 11;

        if (resto !== 0) {
          return new RetornoDTO().construtorComErro('CNS inválido.');
        } else {
          return new RetornoDTO();
        }
      }

      return new RetornoDTO().construtorComErro('CNS inválido.');
    } else {
      return new RetornoDTO();
    }
  }


  static validaCep(cep: string): RetornoDTO {
    if (cep && cep.replace('-', '').length !== 8) {
      return new RetornoDTO().construtorComErro('CEP inválido.');
    }
    return new RetornoDTO();
  }

  static validaEmail(email: string): RetornoDTO {
    var validate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && (!validate.test(String(email).toLowerCase()) || email.length < 6)) {
      return new RetornoDTO().construtorComErro('Email inválido.');
    }
    return new RetornoDTO();
  }

  static validaCelular(celular: string): RetornoDTO {
       var validate = /^[1-9]{2}(?:[2-8]|9[1-9])[0-9]{7}$/;
    if (celular && (celular.length !== 11 || !validate.test(String(celular).toLowerCase()))) {
      return new RetornoDTO().construtorComErro('Celular inválido.');
    }
    return Validator.validaDDD(celular);
  }

  static validaTelefone(telefone: string): RetornoDTO {
    var validate = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-6][0-9])\)?\s?)?(?:((?:9\d|[2-8])\d{3})\-?(\d{4}))$/;
    if (telefone && (telefone.length !== 10 || !validate.test(String(telefone).toLowerCase()))) {
      return new RetornoDTO().construtorComErro('Telefone inválido.');
    }
    return Validator.validaDDD(telefone);
  }

  static validaDDD(telefone: string): RetornoDTO {
    var validate = /^0?(1[1-9]|2[12478]|3[1-8]|4[1-9]|5[13-5]|6[1-9]|7[13-5]|7[79]|8[1-9]|9[1-9])/;
    if (telefone && !validate.test(String(telefone).toLowerCase())) {
      return new RetornoDTO().construtorComErro('DDD inválido.');
    }
    return new RetornoDTO();
  }

  static validaSenha(senha: string): RetornoDTO {
    var validate = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (senha && (senha.length < 8 || !validate.test(senha))) {
      return new RetornoDTO().construtorComErro('A senha deve ter no mínimo 8 caractéres, 1 Maiúsculo e/ou 1 Minúsculo e 1 Número');
    }
    return new RetornoDTO();
  }

  static async validaNome(nome: string, atributo: string): Promise<RetornoDTO> {
    if (nome) {
      if (nome.length < 3) {
        return new RetornoDTO().construtorComErro('O ' + atributo + ' deve conter pelo menos três caracteres.');
      }

      if (!nome.includes(" ")) {
        return new RetornoDTO().construtorComErro('O ' + atributo + ' não deve conter apenas um termo.');
      }

      if (nome.includes("  ")) {
        return new RetornoDTO().construtorComErro('O ' + atributo + ' não deve conter espaços duplos.');
      }

      let nameSplit = nome.split(" ");
      if (nameSplit.length >= 2) {
        if ((nameSplit[0].length <= 1 && nameSplit[1].length <= 1)) {
          return new RetornoDTO().construtorComErro('O primeiro e segundo termos do ' + atributo + ' não devem conter apenas um caracter.');
        }
        if (nameSplit.length == 2 && nameSplit[0].length <= 2 && nameSplit[1].length <= 2) {
          return new RetornoDTO().construtorComErro('O ' + atributo + ' não deve conter apenas dois termos com apenas dois caracteres em cada.');
        }
      }
    }

    return new RetornoDTO()
  }

}
