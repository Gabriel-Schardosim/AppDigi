import {useEffect, useState} from 'react';
import {ObjetoUtilsService} from '../../services/ObjetoUtilsService';
import {ValidationDTO} from './ValidationDTO';
import {Validator} from '../../services/Validator';

const useForm = (object) => {
    const [values, setValues] = useState(object);
    const [validations, setValidations] = useState<Array<ValidationDTO>>([]);
    const [auxValidations, setAuxValidations] = useState({});
    const [valid, setValid] = useState(false);

    useEffect(() => {
        handleValidation();
    }, [validations, values]);

    function handleValidation() {
        let letValid = true;
        for (let val of validations) {
            let value = null;
            if (ObjetoUtilsService.isArray(values)) {
                let index = val.key.substring(0, val.key.lastIndexOf(']') + 1).replace('[', '').replace(']', '');
                let key = val.key.substring(val.key.lastIndexOf(']') + 2);
                value = ObjetoUtilsService.percorreCaminhoObjeto(values[index], key);
            } else if (val.key.includes('[') && val.key.includes(']')) {
                value = ObjetoUtilsService.percorreCaminhoObjeto(values, val.key.substring(0, val.key.indexOf('[')));
                if (value != null && value.length > 0) {
                    value = value[Number(val.key.substring(val.key.indexOf('[') + 1, val.key.indexOf(']')))];
                    value = ObjetoUtilsService.percorreCaminhoObjeto(value, val.key.substring(val.key.indexOf(']') + 2));
                }
            } else {
                value = ObjetoUtilsService.percorreCaminhoObjeto(values, val.key);
            }
            if (val.required && (value == null || value === '' || JSON.stringify(value) === '{}' || JSON.stringify(value) === '[]')) {
                letValid = false;
            }
            if (val.type === 'cpf' && (value !== null && value !== '') && Validator.validaCpf(value).error) {
                letValid = false;
            }
            if (val.type === 'cns' && (value !== null && value !== '') && Validator.validaCns(value).error) {
                letValid = false;
            }
            if (val.type === 'date' && (value !== null && value !== '') && (new Date(value).getTime() < new Date('1700-01-01').getTime())) {
                letValid = false;
            }
            if (val.type === 'cep' && (value !== null && value !== '') && Validator.validaCep(value).error) {
                letValid = false;
            }
            if (val.type === 'email' && (value !== null && value !== '') && Validator.validaEmail(value).error) {
                letValid = false;
            }
            if (val.type === 'celular' && (value !== null && value !== '') && Validator.validaCelular(value).error) {
                letValid = false;
            }
            if (val.type === 'telefone' && (value !== null && value !== '') && Validator.validaTelefone(value).error) {
                letValid = false;
            }
            if ((value != null && value !== '') && val.validateCustom(value).error) {
                letValid = false;
            }
        }
        setValid(letValid);
    }

    const handleChange = (value: any, key: string) => {
        const auxValidations = {...validations};
        auxValidations[key] = true;
        setAuxValidations(auxValidations);
        console.log("value: "+ JSON.stringify(value));
        console.log("key: "+ key);
        setValues(ObjetoUtilsService.percorreCaminhoObjetoSetValue(values, key, value));

        handleValidation();
    };

    const handleChangeArray = (value: any, key: string) => {
        const auxValidations = {...validations};
        auxValidations[key] = true;
        setAuxValidations(auxValidations);

        let index = key.substring(0, key.lastIndexOf(']') + 1).replace('[', '').replace(']', '');
        key = key.substring(key.lastIndexOf(']') + 2);
        values[key] = ObjetoUtilsService.percorreCaminhoArraySetValue(values[index], key, value);
        setValues(values);

        handleValidation();
    };

    const handleSubmit = (onSubmit: ((route: string) => void), route: string) => {
        onSubmit(route)
    };

    const getValidation = (key: string) => {        
        if (validations?.filter(val => val.key === key)) {
            return validations?.filter(val => val.key === key)[0]
        } else {
            return null;            
        }
    };

    return [values, setValues, valid, setValidations, handleChange, handleSubmit, handleChangeArray, getValidation];
};

export default useForm;
