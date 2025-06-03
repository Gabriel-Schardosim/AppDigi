import {RetornoDTO} from '../../models/objects/RetornoDTO';

export class ValidationDTO {
    key: string;
    required: boolean;
    type: '' | 'cpf' | 'date' | 'cns' | 'cep' | 'email' | 'celular' | 'telefone' | 'cpf-cnpj' | 'number' | 'custom' | 'custom-numeric' | 'image';
    validateCustom: ((value) => RetornoDTO);
    maskCustom?: string;

    constructor(key: string, required?: boolean, type?: '' | 'cpf' | 'date' | 'cns' | 'cep' | 'email' | 'celular' | 'telefone' | 'cpf-cnpj' | 'number' | 'custom' | 'custom-numeric' | 'image',
                validateCustom?: ((value) => RetornoDTO), maskCustom?: string,) {
        this.key = key;
        this.required = required ? required : false;
        this.type = type ? type : '';
        this.validateCustom = validateCustom ? validateCustom : ((value) => {
            return new RetornoDTO()
        });
        this.maskCustom = maskCustom;
    }
}
