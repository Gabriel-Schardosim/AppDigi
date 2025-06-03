export class StringUtilsService {

  static formataCpfCnpj(text: string): string {
    if (text) {
      if (text.length <= 11) {
        return text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4');
      } else {
        return text.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3\/\$4\-\$5');
      }
    } else {
      return '';
    }
  }

  static formataCEP(text: string): string {
    if (text) {
      return text.replace(/(\d{2})(\d{3})(\d{3})/g, '\$1.\$2\-\$3');
    } else {
      return '';
    }
  }

  static formataTelefone(text: string): string {
    if (!text) {
      return '';
    } else if (text.length > 10) {
      return text.replace(/(\d{2})(\d{5})(\d{4})/g, '(\$1) \$2\-\$3');
    } else {
      return text.replace(/(\d{2})(\d{4})(\d{4})/g, '(\$1) \$2\-\$3');
    }
  }

  static removeMascaraCpfCnpj(text: string): string {
    return text ? text.replace(/[^0-9]+/g, '') : '';
  }

  static removeMascaraTelefone(text: string): string {
    return text ? text.replace(/[^0-9]+/g, '') : '';
  }

  static uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static firstLetterUpper(text: string): string {
    if (text && text.length > 1) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text;
  }

  static firstLetterLower(text: string): string {
    if (text && text.length > 1) {
      text = text.charAt(0).toLowerCase() + text.slice(1);
    }
    return text;
  }
}
